# Regra: Criar um novo Endpoint

Este projeto segue **Arquitetura Hexagonal (Ports & Adapters)**. Todo novo endpoint **deve** seguir as camadas e padrões descritos abaixo, na ordem indicada.

---

## Estrutura de pastas

```
server/src/
├── domain/
│   ├── entities/           # Entidades de domínio (classes)
│   ├── repositories/       # Interfaces (Ports) — contratos abstratos
│   └── services/<recurso>/ # Casos de uso / regras de negócio
├── infrastructure/
│   ├── database/           # Adapters de banco (Prisma)
│   ├── Providers/          # Adapters de libs externas (bcrypt, jwt, etc.)
│   └── http/<recurso>/     # Controllers (entrada HTTP)
├── errors/                 # Classes de erro customizadas
├── middlewares/             # Middlewares Express (errorHandling, auth, etc.)
├── routes/                 # Arquivos de rota por recurso
└── types/                  # Tipos auxiliares (Request types, etc.)

packages/validators/src/
└── schemas/                # Schemas Zod compartilhados (validação)
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

> **Importante:** Após alterar o pacote de validators, o build em watch (`npm run build`) irá recompilar automaticamente. Caso não esteja rodando, execute `npm run build` em `packages/validators`.

---

### 2. Interface / Port (`domain/repositories`)

Se o endpoint exigir uma dependência externa que ainda não possua interface, criar a interface em `domain/repositories/`.

```typescript
// domain/repositories/NomeRepository.ts
export interface NomeRepository {
  metodo(param: string): Promise<TipoRetorno>;
}
```

**Interfaces já existentes:**

- `BarbershopRepository` — `create`, `findByEmail`
- `HashRepository` — `hash`, `compare`
- `TokenRepository` — `sign`, `verify`

> **Regra:** O Service (domínio) **nunca** importa bibliotecas externas diretamente. Ele depende apenas de interfaces.

---

### 3. Adapter (`infrastructure/database` ou `infrastructure/Providers`)

Implementar a interface criada no passo anterior usando a biblioteca concreta.

- **Banco de dados** → `infrastructure/database/PrismaNomeAdapter.ts`
- **Libs externas** → `infrastructure/Providers/NomeAdapter.ts`

```typescript
// infrastructure/Providers/ExemploAdapter.ts
import { NomeRepository } from '@/src/domain/repositories/NomeRepository.js';

export class ExemploAdapter implements NomeRepository {
  async metodo(param: string): Promise<TipoRetorno> {
    // implementação concreta usando a lib
  }
}
```

**Adapters já existentes:**

- `PrismaBarbershopAdapter` → implementa `BarbershopRepository`
- `BcryptHashAdapter` → implementa `HashRepository`
- `JwtTokenAdapter` → implementa `TokenRepository`

---

### 4. Service / Caso de uso (`domain/services/<recurso>`)

Criar o Service em `domain/services/<recurso>/NomeService.ts`.

**Regras do Service:**

- Recebe as interfaces (Ports) via **injeção de dependência no constructor**
- Contém **toda a lógica de negócio**
- Lança `AppError` para erros de negócio (com statusCode adequado)
- **Não** importa adapters concretos, frameworks ou bibliotecas externas
- Tipagem do parâmetro de `execute()` vem do schema Zod ou de um tipo em `types/`

```typescript
// domain/services/recurso/ExemploService.ts
import { ExemploSchema } from '@sistema-barbearia/validators';

import { BarbershopRepository } from '../../repositories/BarbershopRepository.js';
import { AppError } from '@/src/errors/AppError.js';

export class ExemploService {
  constructor(
    private barbershopRepository: BarbershopRepository,
    // demais repositórios necessários...
  ) {}

  async execute(data: ExemploSchema) {
    // Validações de negócio
    // Lançar AppError quando necessário:
    // throw new AppError('Mensagem de erro', 400);

    // Operações via repositórios injetados
    // Retornar resultado
    return { message: 'Operação realizada com sucesso!' };
  }
}
```

---

### 5. Controller (`infrastructure/http/<recurso>`)

Criar o Controller em `infrastructure/http/<recurso>/NomeController.ts`.

**Regras do Controller:**

- Classe com método **`static async handle(req, res)`**
- Valida o body/params com `Schema.parse()`
- Instancia os **Adapters concretos**
- Instancia o **Service** injetando os Adapters
- Chama `service.execute()` e retorna o resultado via `res.status().json()`
- **Não** contém lógica de negócio

```typescript
// infrastructure/http/recurso/ExemploController.ts
import { Request, Response } from 'express';

import { ExemploSchema } from '@sistema-barbearia/validators';

import { PrismaBarbershopAdapter } from '@/src/infrastructure/database/PrismaBarbershopAdapter.js';
import { ExemploService } from '@/src/domain/services/recurso/ExemploService.js';

export class ExemploController {
  static async handle(req: Request, res: Response) {
    const body = ExemploSchema.parse(req.body);

    const prismaBarbershopAdapter = new PrismaBarbershopAdapter();

    const exemploService = new ExemploService(prismaBarbershopAdapter);

    const result = await exemploService.execute(body);

    return res.status(200).json(result);
  }
}
```

---

### 6. Rota (`routes/`)

Adicionar a rota no arquivo de rotas do recurso correspondente em `routes/<recurso>Routes.ts`.

```typescript
// routes/recursoRoutes.ts
import { Router } from 'express';

import { ExemploController } from '../infrastructure/http/recurso/ExemploController.js';

const router = Router();

router.post('/', ExemploController.handle);

export default { baseUrl: '/recurso', router };
```

**Convenção de export:** Todo arquivo de rota exporta `default` com `{ baseUrl, router }`.  
O auto-loader em `routes/index.ts` registra automaticamente qualquer novo arquivo de rota — **não é necessário** editar o `index.ts`.

---

## Tratamento de Erros

Os erros são capturados automaticamente pelo middleware `errorHandling`. Basta lançar:

| Tipo de Erro                    | Onde Lançar                            | Exemplo                               |
| ------------------------------- | -------------------------------------- | ------------------------------------- |
| `AppError`                      | Service                                | `throw new AppError('Mensagem', 404)` |
| `ZodError`                      | Controller (automático via `.parse()`) | Status 422 automático                 |
| `PrismaClientKnownRequestError` | Adapter (automático)                   | Tratado no middleware                 |

---

## Checklist rápido

- [ ] Schema Zod criado em `packages/validators/src/schemas/` e exportado no `index.ts`
- [ ] Interface (Port) criada em `domain/repositories/` (se necessário)
- [ ] Adapter criado em `infrastructure/database/` ou `infrastructure/Providers/` (se necessário)
- [ ] Service criado em `domain/services/<recurso>/` com injeção de dependência
- [ ] Controller criado em `infrastructure/http/<recurso>/` com método `static async handle`
- [ ] Rota registrada em `routes/<recurso>Routes.ts` com export `{ baseUrl, router }`
- [ ] Build do validators executado (se schema foi adicionado/alterado)

---

## Fluxo de dependência

```
Rota → Controller → Service → Interface (Port)
                        ↑              ↑
                   Adapter ────────────┘
                (implementa a interface)
```

**O domínio (Service) nunca conhece a infraestrutura.** Ele depende apenas de interfaces. O Controller é responsável por montar as dependências concretas e injetá-las no Service.
