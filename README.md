# Sistema Barbearia

SaaS de agendamento para barbearias: cada barbearia tem sua própria página pública de reservas, um painel administrativo completo e uma assinatura recorrente (com o primeiro mês sendo gratuito, não sendo necessário cartão de crédito) que libera o acesso ao sistema.

- [Funcionalidades](#funcionalidades)
- [Link do Projeto](#link)
- [Screenshot GIF](#screenshot-gif)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Melhorias futuras](#melhorias-futuras)

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

## Link
https://salao-flow-client.vercel.app/register/recruiter

## Screenshot GIF
### Autenticação
![autenticacao](https://github.com/user-attachments/assets/ba1896f5-0a46-4e3b-9b67-9ae7440f1344)
#### Criação de profissionais
![profissionais](https://github.com/user-attachments/assets/4ca1113a-8bd5-4046-9bbf-20d446b7d621)
#### Criação de Serviços
![serviços](https://github.com/user-attachments/assets/f65ec227-3d95-4160-aa38-64cec0400c18)
#### Expedientes
![expedientes](https://github.com/user-attachments/assets/8d017786-8307-456f-b18b-a41b8d2aa715)
#### Bloqueio de Horários
![bloqueio de horários](https://github.com/user-attachments/assets/07191666-9751-4465-ba81-4d6467c4a199)
#### Configurações
![configurações](https://github.com/user-attachments/assets/143e8f03-2e81-4ab6-94d4-9a8bca006427)
#### Assinatura
![assinatura](https://github.com/user-attachments/assets/e0ef9d45-c139-42a3-9ce9-5a68bef8a106)
#### Dashboard - Agendamento
![dashboard agendamento](https://github.com/user-attachments/assets/78892939-1b68-4da4-aeac-21f3a1e1374b)
#### Página de Agendamento (Clientes fazem o próprio agendamento)
![página de agendamento](https://github.com/user-attachments/assets/24610dac-0dc7-43ec-8cb8-98a22b39652d)

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
