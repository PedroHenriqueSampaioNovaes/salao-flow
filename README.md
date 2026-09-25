# Sistema Barbearia

SaaS de agendamento para barbearias: cada barbearia tem sua própria página pública de reservas, um painel administrativo completo e uma assinatura recorrente (com o primeiro mês sendo gratuito, não sendo necessário cartão de crédito) que libera o acesso ao sistema.

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
  - Gerenciamento de assinatura
- **Autenticação** com login e cadastro, sessão via JWT
- **Notificações em tempo real** entre painel e agenda via Socket.io
- **Rotina automática (cron)** para limpar agendamentos antigos do banco e contas temporárias de recrutador
- **Envio de e-mails transacionais** para exibir os detalhes do agendamento ao cliente, resete de senha e avisar a barbearia sobre novo agendamento

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Query, React Hook Form, Shadcn/ui, Radix UI |
| Backend | Node.js, Express 5, Prisma ORM 7, PostgreSQL, JWT, Socket.io, Resend, Stripe |
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

## Melhorias futuras
- Criar sistema de métricas completo
- Integração da plataforma com o WhatsApp para enviar lembretes sobre o agendamento aos clientes das barbearias
- Atendente virtual para atender automaticamente os clientes que entrarem em contato com o WhatsApp das barbearias

## Licença

Todos os direitos reservados ©
