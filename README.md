# 🍔 Food Delivery App

A **full-stack food delivery web application** developed as a university project.  
The system allows users to browse restaurants and menus, manage carts, place orders, track deliveries, and manage profiles, while providing an admin dashboard for monitoring orders and sales.

---

## 📌 Project Overview

This project is a complete **food delivery platform** that demonstrates full-stack web development concepts, including frontend–backend integration, RESTful APIs, authentication, and database design.

It includes:
- User authentication and profile management
- Restaurant and menu browsing
- Cart and checkout workflow
- Order tracking
- Reviews and ratings
- Admin dashboard with sales and order reports
- Well-structured relational database design

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- Context API (Auth, Cart, Checkout)
- CSS
- REST API integration

### Backend
- Node.js
- Express.js
- RESTful API architecture
- JWT authentication
- Middleware-based authorization

### Database
- Relational SQL database
- ERD design
- Stored procedures
- Indexing and seed data

---

## 📂 Project Structure

```text
FoodDeliveryApp/
│
├── backend/
│   ├── server.js
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       ├── middleware/
│       ├── jobs/
│       └── utils/
│
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Home/
│   │   ├── Menu/
│   │   ├── cart/
│   │   ├── auth/
│   │   ├── profilepage/
│   │   ├── AdminPanel/
│   │   ├── context/
│   │   └── services/
│   ├── public/
│   └── vite.config.js
│
├── database/
│   ├── ERD.pdf
│   ├── schema.sql
│   ├── procedures.sql
│   ├── indexing.sql
│   └── SeedData.sql
│
└── README.md
```

---

## ✨ Features

### User Features
- User registration and login
- Browse restaurants and menus
- Add and remove items from cart
- Checkout and place orders
- Track order status
- Submit reviews and ratings
- Manage profile, addresses, and payments

### Admin Features
- Admin authentication
- Dashboard overview
- Order reports
- Sales reports
- Menu and item management

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- SQL database

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

- Backend runs on:
```dts
http://localhost:3000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs on:
```dts
http://localhost:5173
```

---

## 👥 Contributors
1. Maryam Hendawy \[UI/UX Designer]
2. Malak Elsayed \[Front-End]
3. Nada Emad \[Front-End]
4. Nourhan Hamada \[Database Engineering]
5. Maram Mohsen \[Database Engineering]
6. Shahd Ayman \[Database Engineering]
7. Mohamed Osama \[Back-End]
8. Ahmed Amir \[Back-End]
9. Ahmed Elhadary \[Back-End]

---

## 📚 Academic Note
This project was developed as part of a university Web Programming course, focusing on:
- Full-stack development
- RESTful APIs
- Database design
- Clean architecture and separation of concerns

