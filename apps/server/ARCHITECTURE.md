# Arquitetura do Backend (`apps/server`)

Este documento descreve como o backend é construído, o padrão arquitetural adotado e a separação de responsabilidades entre os arquivos.

## Visão geral

API REST em **Express 5 + Prisma**, escrita em TypeScript com ESM (`"type": "module"`), parte de um monorepo (`apps/client`, `apps/server`, `packages/validators`).

O padrão é uma **arquitetura em camadas (layered) do tipo Rotas → Controllers → Services → Repositories → Prisma**, uma variante leve de clean architecture (sem DDD/hexagonal completo: não há entidades de domínio, ports/adapters, nem container de DI). A validação de entrada é centralizada num pacote compartilhado (`@sistema-barbearia/validators`) com Zod, usado tanto pelo servidor quanto pelo client.

```
Requisição HTTP
   │
   ▼
Route (Express Router, um arquivo por domínio, montado automaticamente)
   │  → aplica middlewares de auth/autorização (verifyToken, verifyBarbershopStatus, verifyCronSecret)
   ▼
Controller (classe com método estático `handle`; valida entrada com Zod; chama um Service; monta a resposta HTTP)
   │
   ▼
Service (classe; recebe repositories via parâmetros default do construtor; concentra regras de negócio,
         orquestração, transações e efeitos colaterais como e-mail/socket)
   │
   ▼
Repository (uma classe por model do Prisma; encapsula queries; aceita client de transação opcional)
   │
   ▼
Prisma Client (singleton, driver adapter @prisma/adapter-pg) → PostgreSQL
```

Preocupações transversais: `AppError` + middleware global `errorHandling` para respostas de erro consistentes; validação com Zod via `@sistema-barbearia/validators`; cadeia de middlewares JWT para autenticação/autorização; Socket.IO para eventos em tempo real no dashboard, autenticado com o mesmo JWT e isolado por tenant (barbearia).

## Estrutura de diretórios

```
apps/server/
├── prisma/
│   ├── schema.prisma          # schema único, todos os models
│   └── migrations/            # histórico de migrations do Prisma Migrate
├── generated/prisma/          # PrismaClient gerado (output path customizado)
└── src/
    ├── index.ts                # bootstrap: Express + http.Server + Socket.IO
    ├── routes/                 # um Router por domínio + index.ts com auto-loader
    ├── controllers/            # adaptadores HTTP finos, agrupados por domínio
    ├── services/                # regra de negócio / casos de uso, mesmos domínios dos controllers
    ├── repositories/           # uma classe por model do Prisma (pasta plana)
    ├── middlewares/            # verifyToken, verifyBarbershopStatus, verifyCronSecret, errorHandling
    ├── lib/                    # singletons de clientes externos (prisma, socket, resend, stripe)
    ├── errors/AppError.ts      # classe de erro de aplicação
    ├── interfaces/             # tipos TS compartilhados
    ├── emails/                 # templates HTML de e-mail
    └── utils/                  # funções puras auxiliares

packages/validators/
└── src/
    ├── index.ts                 # re-exporta zod + todos os schemas
    └── schemas/*.ts              # um schema Zod por domínio
```

Não há pasta de testes em `apps/server` (nenhum framework de teste configurado nele; os testes com Jest existem apenas em `apps/client`).

## Entry point (`src/index.ts`)

```ts
import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use('/webhooks/stripe', express.raw({ type: 'application/json' })); // raw body p/ verificar assinatura Stripe
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(routes);          // router agregado, montado por auto-loader
app.use(errorHandling);   // middleware de erro global, sempre por último

initializeSocket(server); // Socket.IO compartilha o mesmo http.Server
server.listen(process.env.PORT, ...);
```

Pontos-chave:
- Express é envolvido num `http.Server` bruto para que o Socket.IO compartilhe a mesma porta.
- `express.raw()` é aplicado **apenas** na rota `/webhooks/stripe`, antes do `express.json()` global, para permitir a verificação de assinatura do webhook.
- Sem helmet, rate-limiting ou logging estruturado.

### Auto-loader de rotas (`src/routes/index.ts`)

Em vez de importar cada rota manualmente, o arquivo lê o diretório `routes/` em tempo de execução e monta cada módulo pela convenção `export default { baseUrl, router }`:

```ts
async function addFilesInTheRouter(files: string[]) {
  for (const file of files) {
    const routeModule = await import(`./${file}`);
    router.use(routeModule.default.baseUrl, routeModule.default.router);
  }
}
```

## Camadas

### Routes
Um `Router()` por domínio, encadeando middlewares por rota:

```ts
router.post('/', CreateAppointmentController.handle); // criação pública (fluxo de agendamento do cliente)
router.get('/', verifyToken, verifyBarbershopStatus, ListAppointmentController.handle);
router.delete('/:id', verifyToken, verifyBarbershopStatus, DeleteAppointmentController.handle);

export default { baseUrl: '/appointments', router };
```

### Controllers
Classes com **método estático `handle`**: parseiam `req.body` com Zod, instanciam um Service (`new XService()`), chamam `.execute(...)` e moldam a resposta. Nunca acessam o Prisma diretamente. Não há `try/catch` — erros lançados sobem até o middleware global (Express 5 captura promises rejeitadas automaticamente).

### Services
Classes que concentram a regra de negócio. Os repositories são "injetados" via **parâmetros default do construtor** (DI manual, sem container):

```ts
export class CreateAppointmentService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly barbershopRepository = new BarbershopRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
    // ...
  ) {}

  async execute(data: CreateAppointmentSchema, options?: { isPanelRequest?: boolean }) { ... }
}
```

Exemplo mais rico (`CreateAppointmentService`): valida horário/turno com `@js-temporal/polyfill`, executa a escrita crítica dentro de `prisma.$transaction`, adquire um **advisory lock do Postgres** por funcionário (`pg_advisory_xact_lock`) para evitar agendamentos concorrentes conflitantes, e dispara e-mails de confirmação (não bloqueante) após o commit.

### Repositories
Uma classe por model do Prisma (pasta plana, sem subpastas de domínio). Cada método aceita um client de transação opcional, permitindo participar de uma transação iniciada no Service:

```ts
export class AppointmentRepository {
  async create(data: AppointmentData, barbershopId: number, client: PrismaClientOrTransaction = prisma) { ... }
  async acquireEmployeeLock(employeeId: number, client: PrismaClientOrTransaction) {
    await client.$executeRaw`SELECT pg_advisory_xact_lock(${employeeId})`;
  }
}
```

### Middlewares
- `verifyToken.ts` — valida JWT (`Authorization: Bearer <token>`), anexa `req.barbershopId`.
- `verifyBarbershopStatus.ts` — autorização: bloqueia acesso se a assinatura da barbearia estiver inativa.
- `verifyCronSecret.ts` — autenticação por segredo estático para endpoints de cron.
- `errorHandling.ts` — handler de erro global (ver seção de erros).

### Validação (Zod)
Schemas vivem em `packages/validators/src/schemas/*.ts`, um arquivo por domínio, compartilhados entre server e client:

```ts
export const createAppointmentSchema = z.object({ date: z.string()..., email: z.email(...), ... });
export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
```

Uso nos controllers: `const body = createAppointmentSchema.parse(req.body)` — `ZodError` é convertido pelo handler global em `422`.

## Banco de dados (Prisma)

- Schema único: `prisma/schema.prisma` (models: `Barbershop`, `Subscription`, `Employee`, `EmployeeSchedule`, `Customer`, `Service`, `Appointment`, `ScheduleBlock`, etc.).
- Client gerado num output customizado (`generated/prisma`), não no padrão `node_modules/.prisma`.
- **Singleton** em `src/lib/prisma.ts`, usando o driver adapter `@prisma/adapter-pg`:

```ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;
```

- Transações explícitas com `prisma.$transaction(async (tx) => {...})` nos Services, passando `tx` para os métodos de repository que precisam participar da mesma transação.

## Autenticação e autorização

- **JWT** (`jsonwebtoken`), emitido no login da barbearia (`bcryptjs.compareSync` + `jwt.sign({ id }, ..., { expiresIn: '7d' })`).
- O token identifica uma **Barbershop** (conta/tenant), não um usuário individual — não há sistema de roles/usuários separados.
- Toda query de repository é filtrada por `barbershopId` (multi-tenant).
- `verifyBarbershopStatus` é uma segunda camada de autorização, checando se a assinatura está ativa.
- O Socket.IO usa o mesmo JWT (`socket.handshake.auth.token`) para autenticar conexões e isolar eventos por sala (`barbershop:${slug}`).
- Rotas públicas (ex.: `POST /appointments`, usada pela página pública de agendamento) não exigem token; `isAuthenticatedRequest` distingue requisições vindas do painel autenticado das públicas.

## Tratamento de erros

`src/errors/AppError.ts`:
```ts
export class AppError extends Error {
  constructor(message: string, public readonly statusCode = 400) { super(message); }
}
```

`src/middlewares/errorHandling.ts` (registrado por último), trata em ordem:
1. `AppError` → `statusCode` + `{ ok: false, message }`
2. `ZodError` → `422` com a primeira mensagem de validação
3. `Prisma.PrismaClientKnownRequestError` → `P2002` (unique) → `409`, `P2025` (not found) → `404`, senão `400`
4. `Error` genérico → `400`
5. Valor desconhecido lançado → log + `500`

Controllers não usam `try/catch`: dependem da captura automática de erros assíncronos do Express 5.

## Injeção de dependência

Não há container de DI (Inversify, tsyringe, etc.). A composição é manual:
- Controller → `new XService()`
- Service → repositories via parâmetros default do construtor
- Rotas → montadas automaticamente por convenção de arquivo (`routes/index.ts`)

## Configuração

- `dotenv/config` carregado no topo de `index.ts` (e defensivamente em `lib/prisma.ts` e `lib/socket.ts`).
- Variáveis principais (`.env.example`): `PORT`, `FRONTEND_URL`, `DATABASE_URL`, `JWT_SECRET`, `CRON_SECRET`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.
- Sem validação de schema de env (lidas via `process.env.X`, com cast `as string` quando necessário).
- Alias de path `@/*` → `./*` (resolvido por `tsc-alias` no build; nativamente pelo `tsx` em dev).

## Exemplo de fluxo vertical completo: criar agendamento

1. **Route** `src/routes/appointmentRoutes.ts` — `POST /appointments` (pública).
2. **Controller** `CreateAppointmentController` — valida com `createAppointmentSchema`, chama `CreateAppointmentService.execute`, emite evento `new-appointment` via Socket.IO, retorna `201`.
3. **Service** `CreateAppointmentService` — carrega barbearia/funcionário/serviços, calcula horários com Temporal, dentro de uma transação: adquire lock por funcionário, checa bloqueios de agenda e conflitos, faz upsert do cliente, cria o agendamento; após o commit, envia e-mails de confirmação (não bloqueante).
4. **Repository** `AppointmentRepository.create` — grava no Postgres via Prisma, incluindo os serviços relacionados.
5. **Banco** — models `Appointment`, `AppointmentService`, `Customer`, `Employee`, `Barbershop` em `prisma/schema.prisma`.

## Testes

Atualmente não há testes automatizados para o backend (`apps/server`). Os testes existentes no monorepo (Jest) cobrem apenas componentes/hooks de `apps/client`.
