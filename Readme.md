# 🛍️ Zavyar E-Commerce Backend

> A production-ready **E-Commerce REST API** built using **Node.js, Express, and MongoDB**,

---

## 🚀 Overview

This backend powers a modern e-commerce platform — managing **users, products, orders, payments, and reviews** — with **JWT authentication**, **admin dashboards**, and **MongoDB analytics**.

---

## 🧠 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Server** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **Cloud Storage** | Cloudinary |
| **Utilities** | Multer, Bcrypt, Dotenv, Cookie-Parser |
| **Documentation** | Swagger UI Express |
| **Error Handling** | Custom ApiError & asyncHandler |

---

## ⚙️ Features

### 🧑‍💼 User
- Register & Login with JWT Authentication  
- Update profile and password  
- View order history  
- Post product reviews with images  
- Like or unlike reviews  

### 🧠 Admin
- Manage users, products, and orders  
- Change order statuses (`pending`, `processing`, `shipped`, `delivered`, `cancelled`)  
- View dashboard stats with MongoDB aggregation  

### 💳 Core E-Commerce
- Full CRUD for products  
- Order management system  
- Review & rating system  
- Cloudinary image uploads  
- Dashboard with total counts & revenue  

---

## 🧩 Project Structure


---

## 📡 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET`  | `/api/auth/me` | Get current user info |
| `POST` | `/api/auth/logout` | Logout user |

### 🛒 Products
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get product details |
| `POST` | `/api/products` | Create product *(Admin)* |
| `PUT` | `/api/products/:id` | Update product *(Admin)* |
| `DELETE` | `/api/products/:id` | Delete product *(Admin)* |

### 📦 Orders
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders` | Get all orders *(Admin)* |
| `GET` | `/api/orders/:id` | Get order by ID |
| `PUT` | `/api/orders/:id/status` | Update order status *(Admin)* |

### 💬 Reviews
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/reviews/:productId` | Create review |
| `PUT` | `/api/reviews/:reviewId/like` | Toggle like/unlike |
| `GET` | `/api/reviews/:productId` | Get all reviews for a product |

### 📊 Dashboard
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/admin/dashboard` | Get platform statistics *(Admin)* |

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following:

- PORT=3000 or something else
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- CLOUDINARY_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret


---

## 🧰 Installation & Setup

### 1️⃣ Clone Repository

```bash 
git clone 
https://github.com/ZavyarTajdar/zavyar-backend.git
cd E-commerce-Backend-Project
