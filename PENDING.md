# Pendências de Implementação

> Última atualização: todos os itens abaixo foram implementados nesta sessão, exceto onde indicado.

## Concluído nesta sessão

| Item | Arquivo(s) |
|---|---|
| Subscriber `OnOrderWaiting` | `src/domain/delivery/application/subscribers/on-order-waiting.ts` |
| `PrismaOrdersRepository` | `src/infra/database/repositories/orders-repository.ts` |
| `PrismaRecipientsRepository` | `src/infra/database/repositories/recipients-repository.ts` |
| `PrismaAdminsRepository` | `src/infra/database/repositories/admins-repository.ts` |
| `PrismaNotificationsRepository` | `src/infra/database/repositories/notifications-repository.ts` |
| Mappers (Order, Recipient, Admin, Notification) | `src/infra/database/mappers/` |
| `AuthenticateAdminController` | `POST /sessions/admin` |
| Controllers de Entregadores (6) | `POST /couriers`, `GET /couriers`, `GET /couriers/:id`, `PUT /couriers/:id`, `DELETE /couriers/:id`, `PATCH /couriers/:id/password` |
| Controllers de Destinatários (5) | `POST /recipients`, `GET /recipients`, `GET /recipients/:id`, `PUT /recipients/:id`, `DELETE /recipients/:id` |
| Controllers de Encomendas — admin (6) | `POST /orders`, `GET /orders`, `GET /orders/:id`, `PUT /orders/:id`, `DELETE /orders/:id`, `PATCH /orders/:id/waiting` |
| Controllers de Encomendas — entregador (5) | `PATCH /orders/:id/pick-up`, `PATCH /orders/:id/deliver`, `PATCH /orders/:id/return`, `GET /orders/nearby`, `GET /couriers/me/deliveries` |
| `DatabaseModule` e `HttpModule` atualizados | todos os repositórios, use cases e subscribers registrados |

## Pendências restantes

| Item | Descrição |
|---|---|
| Migrations | Confirmar que `prisma migrate dev` está atualizado com o schema atual |
| Testes E2E | Nenhum controller possui testes de integração HTTP ainda |
| Autenticação baseada em role | Controllers admin não bloqueiam entregadores (sem `RoleGuard` implementado) |
