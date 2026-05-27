# Regra: Criar um novo Endpoint

Este projeto segue uma **Arquitetura em Camadas Tradicional e Simplificada**, focada em agilidade e simplicidade, sem o overhead da Arquitetura Hexagonal. Todo novo endpoint **deve** seguir as camadas e padrões descritos abaixo, na ordem indicada.

---

## Estrutura de pastas

```
server/src/
├── controllers/        # Controllers (entrada HTTP, validação de inputs)
├── errors/             # Classes de erro customizadas
├── interfaces/         # Interfaces TypeScript / Tipagem de contratos
├── lib/                # Configurações/instâncias de libs (Prisma, Nodemailer, etc.)
├── middlewares/        # Middlewares Express (errorHandling, auth, etc.)
├── repositories/       # Repositórios (acesso direto ao banco via Prisma)
├── routes/             # Arquivos de rota por recurso
└── services/<recurso>/ # Casos de uso / regras de negócio de cada recurso

packages/validators/src/
└── schemas/            # Schemas Zod compartilhados (validação)
```

---

## Passo a passo para criar um endpoint

### 1. Schema de Validação (`packages/validators`)

Criar o schema Zod em `packages/validators/src/schemas/NomeSchema.ts` e exportá-lo no `index.ts`.

```typescript
// packages/validators/src/schemas/ExemploSchema.ts
import { z } from 'zod';

export const ExemploSchema = z.object({
  campo: z.string().min(1, 'Campo é obrigatório'),
});

export type ExemploSchema = z.infer<typeof ExemploSchema>;
```

```typescript
// packages/validators/src/index.ts — adicionar a linha:
export * from './schemas/ExemploSchema.js';
```

> **Importante:** Após alterar o pacote de validators, o build em watch (`npm run build`) em `packages/validators` irá recompilar automaticamente. Caso não esteja rodando, execute `npm run build` manualmente para que a aplicação server reconheça os novos schemas.

---

### 2. Interface (se necessário) (`server/src/interfaces`)

Definir tipagens personalizadas ou contratos de dados em `server/src/interfaces/<recurso>.ts`.

```typescript
// server/src/interfaces/Exemplo.ts
export interface CriarExemplo {
  campo: string;
}
```

---

### 3. Repositório (`server/src/repositories`)

Se o endpoint precisar de novas operações com o banco de dados, implemente-as na classe correspondente dentro de `server/src/repositories/` ou crie um novo repositório caso o recurso seja novo.

```typescript
// server/src/repositories/ExemploRepository.ts
import { prisma } from '@/src/lib/prisma.js';
import { CriarExemplo } from '@/src/interfaces/Exemplo.js';

export class ExemploRepository {
  async create(data: CriarExemplo) {
    const exemplo = await prisma.exemplo.create({
      data: {
        campo: data.campo,
      },
    });

    return exemplo;
  }

  async getByCampo(campo: string) {
    return prisma.exemplo.findUnique({
      where: { campo },
    });
  }
}
```

---

### 4. Service / Caso de uso (`server/src/services/<recurso>`)

Criar o Service em `server/src/services/<recurso>/NomeService.ts`.

**Regras do Service:**

- Instancia os repositórios necessários diretamente dentro do método `execute` (ex: `const exemploRepository = new ExemploRepository()`)
- Contém **toda a lógica de negócio**
- Lança `AppError` para erros de negócio (com statusCode adequado)
- Utiliza bibliotecas externas (como `bcryptjs`, `jsonwebtoken`) ou utilitários (como `sendMail` de `server/src/lib/nodemailer.js`) diretamente se necessário
- Tipagem do parâmetro de `execute()` vem do schema Zod ou de interfaces em `interfaces/`

```typescript
// server/src/services/recurso/ExemploService.ts
import { ExemploRepository } from '@/src/repositories/ExemploRepository.js';
import { CriarExemplo } from '@/src/interfaces/Exemplo.js';
import { AppError } from '@/src/errors/AppError.js';

export class ExemploService {
  async execute(data: CriarExemplo) {
    const exemploRepository = new ExemploRepository();

    const exemploAlreadyExists = await exemploRepository.getByCampo(data.campo);

    if (exemploAlreadyExists) {
      throw new AppError('Este registro já existe.', 409);
    }

    const result = await exemploRepository.create(data);

    return { 
      message: 'Criado com sucesso!',
      result 
    };
  }
}
```

---

### 5. Controller (`server/src/controllers/<recurso>`)

Criar o Controller em `server/src/controllers/<recurso>/NomeController.ts`.

**Regras do Controller:**

- Classe com método **`static async handle(req, res)`**
- Valida o body/params com `Schema.parse()`
- Instancia o **Service** diretamente e chama `service.execute()`
- Retorna o resultado via `res.status().json()`
- **Não** contém lógica de negócio ou queries de banco

```typescript
// server/src/controllers/recurso/ExemploController.ts
import { Request, Response } from 'express';
import { ExemploSchema } from '@sistema-barbearia/validators';
import { ExemploService } from '@/src/services/recurso/ExemploService.js';

export class ExemploController {
  static async handle(req: Request, res: Response) {
    const body = ExemploSchema.parse(req.body);

    const exemploService = new ExemploService();
    const result = await exemploService.execute(body);

    return res.status(201).json(result);
  }
}
```

---

### 6. Rota (`server/src/routes`)

Adicionar a rota no arquivo de rotas do recurso correspondente em `routes/<recurso>Routes.ts`.

```typescript
// server/src/routes/recursoRoutes.ts
import { Router } from 'express';
import { ExemploController } from '../controllers/recurso/ExemploController.js';

const router = Router();

router.post('/', ExemploController.handle);

export default { baseUrl: '/recurso', router };
```

**Convenção de export:** Todo arquivo de rota exporta `default` com `{ baseUrl, router }`.  
O auto-loader em `routes/index.ts` registra automaticamente qualquer novo arquivo de rota — **não é necessário** editar o `index.ts`.

---

## Tratamento de Erros

Os erros são capturados automaticamente pelo middleware `errorHandling`. Basta lançar:

| Tipo de Erro                    | Onde Lançar                            | Exemplo                               | Status Retornado      |
| ------------------------------- | -------------------------------------- | ------------------------------------- | --------------------- |
| `AppError`                      | Service                                | `throw new AppError('Mensagem', 404)` | Conforme especificado |
| `ZodError`                      | Controller (automático via `.parse()`) | Status 422 automático                 | 422 Unprocessable     |
| `PrismaClientKnownRequestError` | Query banco (automático)               | Tratado no middleware                 | Tratado conforme erro |

---

## Checklist rápido

- [ ] Schema Zod criado em `packages/validators/src/schemas/` e exportado no `index.ts`
- [ ] Interface criada em `server/src/interfaces/` (se necessário)
- [ ] Repositório criado/atualizado em `server/src/repositories/` (se necessário)
- [ ] Service criado em `server/src/services/<recurso>/` instanciando o repositório diretamente no `execute()`
- [ ] Controller criado em `server/src/controllers/<recurso>/` com método `static async handle` instanciando o service
- [ ] Rota registrada em `server/src/routes/<recurso>Routes.ts` com export `{ baseUrl, router }`
- [ ] Build do validators executado (se schema foi adicionado/alterado)

---

## Fluxo de dependência

```
Rota → Controller → Service → Repository → Prisma Client
```

A arquitetura ficou muito mais direta e simples! Sem o overhead de ports, adapters e interfaces para tudo. O Controller gerencia a validação de dados via Zod e despacha para o Service, que coordena as regras de negócio e utiliza diretamente os repositórios (que interagem com o banco via Prisma) e outras libs utilitárias concretas.
