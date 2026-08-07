# Context

Qualquer usuário vai poder solicitar um item, quando o item for solicitado o item deve mudar o status para reservado e enquanto ele tiver reservado para tal usuário nenhum outro deve conseguir reservar (o item reservado e aceito não deve aparecer na rota list all).

O dono do item vai ter uma rota onde vai retornar os seus itens anunciados que foram solicitados onde vai poder rejeitar ou aceitar a compra.

O usuario solicitante vai ter uma rota onde ele podera listar os itens que ele solicitou

# RF

- Deve ser possível criar, rejeitar, aceitar, listar solicitados a venda (vendedor), listar solicitados a compra (comprador)
- Autenticação e Ownership

# RNF

- Deve se utilizar o banco de dados MongoDB
- Deve ser usado os Custom Errors existentes
- Manipule o Price usando o value object existente
- Faça validação dos dados de entrada com Zod
- Nunca use ANY, sempre tipe a request

## OrderModel

```json
{
  "buyerId": "id",
  "sellerId": "id",
  "orderId": "id",
  "status": "accepted | rejected | waiting",
  "price": number, // preço do item
  "type": "sale", // crie um Enum de sale ou donation
}
```

# Endpoints

- `GET /orders?type=buying | selling` - List all orders
- `GET /order/:id` - Get order by id
- `POST /order` - Create order
- `PUT /order/:id` - Update item

# Arquitetura

- Clean Architecture
- SOLID
- DDD (com classes), crie as entities com create static, metodos de manipulação e get e setters
