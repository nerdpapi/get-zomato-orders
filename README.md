# Get Zomato Orders 🍽️
**LIVE LINK :** https://get-zomato-orders.onrender.com/api/orders
A simple Node.js + Express + MySQL API that demonstrates **server-side pagination** using `limit` and `offset` parameters.

This project was built as a capstone-style assignment to test:

- Working with **MySQL** databases
- Implementing **pagination** in an API
- Using **environment variables** for DB config
- Hosting on **Render**
- Documenting the API with **Swagger UI**
- Writing basic **API tests** with Mocha + Chai

---

## 🚀 Features

- `GET /api/orders` endpoint
- Pagination with `limit` and `offset` query params
- Default values when query params are missing or invalid
- MySQL database with an `orders` table and sample data
- Swagger UI docs at `/api-docs`
- Mocha + Chai HTTP tests for pagination behavior
- Ready to deploy on Render (or any Node hosting)

---

## 🧠 Pagination Concept (limit & offset)

The API uses two query parameters:

- `limit` → how many rows to return (per request)
- `offset` → how many rows to skip **before** starting to return rows

Example:

```http
GET /api/orders?limit=4&offset=1

