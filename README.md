# 🛍️ StoreAPI - Full-Stack E-Commerce Platform

![Status](https://img.shields.io/badge/Status-Concluído-success)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

> PFinal project developed for the UC00609 course. A complete e-commerce solution focused on **Performance**, **Security**, and **Resilience**.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Architecture & Tech Stack](#tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [How to Run (Docker)](#-how-to-run-docker)
- [Test Credentials](#-test-credentials)
- [Authors](#-authors)

---

## 📖 About the Project

**StoreAPI** is a web application that simulates a fully functional online store. The system allows customers to browse products, manage their cart, and perform simulated purchases, while administrators and managers oversee the catalog and user base.

The key differentiator of this project is its robust architecture, implementing advanced patterns such as **Service Pattern**, **Hybrid Caching**, and **Microservices Resilience**.

---

## <a id="tech-stack"></a>🛠️ Architecture & Tech Stack

The project follows a microservices-based architecture, containerized via Docker.

### **Backend (.NET 8)**
- **RESTful API:** Clean Controllers using DTOs.
- **Service Pattern:** Business logic isolated from controllers.
- **Entity Framework Core:** ORM for PostgreSQL communication.
- **Cache Híbrido:** Implementation of both local (MemoryCache) and distributed (Redis) caching for high performance.
- **Polly:** **Resilience** implementation (Retry & Circuit Breaker) for HTTP calls and database connections.
- **JWT (JSON Web Token):** Authentication and Authorization with roles (Admin, Manager, Customer).

### **Frontend (React + Vite)**
- **SPA:** Fast and reactive Single Page Application.
- **Bootstrap 5 + Custom CSS:** Modern, responsive, and personalized design.
- **Context API:** Global state management for Authentication.
- **Axios:** HTTP client with interceptors for token management.

### **Infrastructure & Tools**
- **PostgreSQL:** Relational database.
- **Redis:** Distributed cache.
- **Mountebank:** Mock server for payment gateway simulation.
- **Docker Compose:** Orchestration of all services.

---

## ✨ Features

### 👤 Customer
- **Catalog:** View products with pagination, name search, and category filtering.
- **Shopping Cart:** Add/remove items with data persistence.
- **Checkout**: Real-time stock validation and payment simulation.
- **Profile:** Order history, personal data editing, and password management.

### 🛡️ Administration (Admin & Manager)
- **Product Management:** Create, edit, and delete products (with automatic cache invalidation/update).
- **Category Management:** Full CRUD for categories.
- **User Management (Manager Only):** List users and modify permissions (e.g., promote to Admin).

---

## 📂 Project Structure

```bash
api-projeto-final/
├── api/                  # Backend (.NET 8)
│   ├── Controllers/      # API Endpoints
│   ├── Services/         # Business Logic (Caching, DB)
│   ├── Models/           # Database Entities
│   └── DTOs/             # Data Transfer Objects
├── database/             # SQL Scripts (Schema and Initial Seed)
├── frontend/             # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/        # Pages (Home, Cart, Profile, Admin...)
│   │   ├── components/   # Navbar, Footer, ProductCard...
│   │   └── context/      # AuthContext
├── imposter/             # Mountebank Configuration (Payment Mock)
└── docker-compose.yml    # Container Orchestration
```
---

## 🚀 How to Run (Docker)

The easiest way to run the project is using Docker, as it automatically configures the Database, Redis, and the API.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.
- [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Step 1: Infrastructure & Backend (Docker)
The database is automatically configured and populated (Schema + Seed) on the first run, thanks to the mapped volume in Docker Compose.

1. **In the project root, start the services:**

```bash
docker-compose up --build
```
2. **Wait until you see the message indicating the API is running on port 5000.**

**Note:** If you need to reset the database from scratch (to apply seed changes), run: docker-compose down -v (to remove volumes) and then docker-compose up --build again.

### Step 2: Frontend (React)
With the backend running, open a new terminal to start the website.

1. **Navigate to the frontend folder:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

### 🔗 Access Links
Once everything is up and running:

* **Store (Frontend):** http://localhost:5173 (or the port shown in your terminal)

* **API Documentation (Swagger):** http://localhost:5000/swagger

* **Payment Mock (Imposter):** http://localhost:4545

---
## 🔑 Test Credentials
The project starts with dummy data. You can use these accounts to test different access levels:

| Perfil | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `daniel@gmail.com` | `daniel` | Full Management |
| **Manager** | `vitor@gmail.com` | `vitor` | Product Management |
| **Customer** | `user@gmail.com` | `user` | Purchasing |

**Note:** You can register a new account on the Registration page (it will be created with the "Customer" role). To test the Manager role, use the Admin account to change a user's Role in the database or user management interface.

---
## 👥 Authors
**Developed by:**
 - Daniel Grazina

 - Vitor Andrade
