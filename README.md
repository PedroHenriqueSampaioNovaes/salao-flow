# Sistema Barbearia

SaaS de agendamento para barbearias: cada barbearia tem sua própria página pública de reservas, um painel administrativo completo e uma assinatura recorrente que libera o acesso ao sistema.

## Funcionalidades

- **Página pública de agendamento** (`/[slug]`) — clientes marcam horário direto pelo link da barbearia, sem precisar criar conta.
- **Painel administrativo**
  - Dashboard com métricas do negócio
  - Cadastro e gestão de clientes
  - Cadastro de profissionais (funcionários)
  - Cadastro de serviços
  - Expedientes: horários de trabalho por profissional/dia da semana
  - Bloqueios de agenda (folgas, feriados, indisponibilidades pontuais)
  - Configurações da barbearia
- **Autenticação** com login e cadastro, sessão via JWT
- **Notificações em tempo real** entre painel e agenda via Socket.io
- **Rotina automática (cron)** para limpar agendamentos antigos do banco
- **Envio de e-mails transacionais** para exibir os detalhes do agendamento ao cliente, resete de senha e avisar a barbearia sobre novo agendamento

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Query, React Hook Form, Shadcn/ui, Radix UI |
| Backend | Node.js, Express 5, Prisma ORM 7, PostgreSQL, JWT, Socket.io |
| Validação | Zod, em um pacote compartilhado entre client e server |
| Qualidade | Jest + Testing Library (client), Husky, Commitlint (Conventional Commits) |
| Infra | Monorepo com npm workspaces, deploy na Vercel |

## Arquitetura

Monorepo dividido em `apps/` e `packages/`:

```
apps/
  client/       # Next.js (App Router)
  server/       # API REST em Express
packages/
  validators/   # Schemas Zod compartilhados entre client e server
```

O backend segue separação em camadas (`routes → controllers → services → repositories`), com Prisma como camada de acesso a dados e middlewares dedicados (autenticação, verificação de assinatura de webhook).

## Como rodar localmente

Pré-requisitos: Node.js, PostgreSQL.

```bash
# instalar dependências (client, server e pacote de validators)
npm install

# gerar client do Prisma e aplicar migrations
npm run prisma:deploy

# subir client, server e o build watch dos validators juntos
npm run dev
```

Scripts individuais também estão disponíveis: `npm run client`, `npm run server`, `npm run build:client`, `npm run build:server`.

## Licença

ISC
