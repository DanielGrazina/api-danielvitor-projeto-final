# 🛍️ StoreAPI - Plataforma de E-Commerce Full-Stack

![Status](https://img.shields.io/badge/Status-Concluído-success)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

> Projeto final desenvolvido no âmbito da UC00609. Uma solução completa de e-commerce focada em **Performance**, **Segurança** e **Resiliência**.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar (Docker)](#-como-executar-docker)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Autores](#-autores)

---

## 📖 Sobre o Projeto

O **StoreAPI** é uma aplicação web que simula uma loja online completa. O sistema permite aos clientes navegar, adicionar produtos ao carrinho e realizar compras simuladas, enquanto administradores e gestores podem gerir o catálogo e os utilizadores.

O diferencial deste projeto reside na sua arquitetura robusta, implementando padrões como **Service Pattern**, **Cache Híbrido** e **Resiliência de Microsserviços**.

---

## 🛠️ Arquitetura e Tecnologias

O projeto segue uma arquitetura baseada em microsserviços containerizados via Docker.

### **Backend (.NET 8)**
- **API RESTful:** Controllers limpos utilizando DTOs.
- **Service Pattern:** Lógica de negócio isolada dos controladores.
- **Entity Framework Core:** ORM para comunicação com PostgreSQL.
- **Cache Híbrido:** Implementação de cache local (MemoryCache) e distribuído (Redis) para alta performance.
- **Polly:** Implementação de **Resiliência** (Retry & Circuit Breaker) para chamadas HTTP e conexões de base de dados.
- **JWT (JSON Web Token):** Autenticação e Autorização com perfis (Admin, Manager, Customer).

### **Frontend (React + Vite)**
- **SPA:** Single Page Application rápida e reativa.
- **Bootstrap 5 + CSS Custom:** Design moderno, responsivo e personalizado.
- **Context API:** Gestão de estado global para Autenticação.
- **Axios:** Cliente HTTP com interceptors para gestão de tokens.

### **Infraestrutura e Ferramentas**
- **PostgreSQL:** Base de dados relacional.
- **Redis:** Cache distribuído.
- **Mountebank:** Mock server para simulação de gateway de pagamentos.
- **Docker Compose:** Orquestração de todos os serviços.

---

## ✨ Funcionalidades

### 👤 Cliente (Customer)
- **Catálogo:** Visualizar produtos com paginação, filtros por nome e categoria.
- **Carrinho:** Adicionar/remover itens, persistência de dados.
- **Checkout:** Validação de stock em tempo real e simulação de pagamento.
- **Perfil:** Histórico de encomendas, edição de dados pessoais e password.

### 🛡️ Administração (Admin & Manager)
- **Gestão de Produtos:** Criar, editar e apagar produtos (com atualização automática de cache).
- **Gestão de Categorias:** CRUD completo de categorias.
- **Gestão de Utilizadores (Apenas Manager):** Listar utilizadores e alterar permissões (Promover a Admin, etc.).

---

## 📂 Estrutura do Projeto

```bash
api-projeto-final/
├── api/                  # Backend (.NET 8)
│   ├── Controllers/      # Endpoints da API
│   ├── Services/         # Lógica de Negócio (Caching, BD)
│   ├── Models/           # Entidades da Base de Dados
│   └── DTOs/             # Objetos de Transferência de Dados
├── database/             # Scripts SQL (Schema e Seed inicial)
├── frontend/             # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/        # Páginas (Home, Cart, Profile, Admin...)
│   │   ├── components/   # Navbar, Footer, ProductCard...
│   │   └── context/      # AuthContext
├── imposter/             # Configuração do Mountebank (Mock Pagamentos)
└── docker-compose.yml    # Orquestração dos contentores
```
---

## 🚀 Como Executar (Docker)

A forma mais simples de correr o projeto é usando o **Docker**, pois configura automaticamente a Base de Dados, o Redis e a API.

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado.
- [Node.js](https://nodejs.org/) (v18 ou superior) instalado.

### Passo 1: Infraestrutura e Backend (Docker)
A base de dados é **configurada e populada automaticamente** (Schema + Seed) na primeira execução, graças ao volume mapeado no Docker Compose.

1. **Na raiz do projeto, inicie os serviços:**
   ```bash
   docker-compose up --build
   ```
2. **Aguarde até ver a mensagem de que a API está a correr na porta 5000.**

    **Nota:** Se precisar de reiniciar a base de dados do zero (para aplicar alterações no seed), execute: docker-compose down -v (para apagar os volumes) e depois docker-compose up --build novamente.

### Passo 2: Frontend (React)
Com o backend a correr, abra um novo terminal para iniciar o site.

1. **Entre na pasta do frontend:**

```bash
cd frontend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

### 🔗 Links de Acesso
Depois de tudo iniciado:

Loja (Frontend): http://localhost:5173 (ou a porta indicada no terminal do Vite)

Documentação API (Swagger): http://localhost:5000/swagger

Mock de Pagamentos (Imposter): http://localhost:4545

---
## 🔑 Credenciais de Teste
O projeto inicia com dados fictícios. Podes usar estas contas para testar os diferentes níveis de acesso:
| Perfil | Email | Password | Permissões |
| :--- | :--- | :--- | :--- |
| **Admin** | `daniel@gmail.com` | `daniel` | Gestão Total |
| **Manager** | `vitor@gmail.com` | `vitor` | Gestão de Produtos |
| **Cliente** | `user@gmail.com` | `user` | Comprar |

**Nota:** Podes registar uma nova conta na página de Registo (será criada com perfil "Customer"). Para testar o Manager, usa o Admin para alterar o Role de um utilizador na base de dados ou na gestão de users (se disponível).

---
## 👥 Autores
**Desenvolvido por:**
 - Daniel Grazina

 - Vitor Andrade