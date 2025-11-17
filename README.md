# WTWR (What To Wear) – Backend

This is the backend for the **WTWR – What To Wear** application.  
The server handles users, authentication, and clothing items, and exposes a REST API built with **Node.js**, **Express**, and **MongoDB**.

---

## 🎥 Project Walkthrough Video

You can watch a short walkthrough of this project here:

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1AuuGBvqa3ktCJwTUsZ8TFXhng1Mc-0TO/view?usp=sharing), where I describe my
project and some challenges I faced while building it.

---

## 🚀 Features

- User registration with **email** and **hashed password**
- User login with **JWT-based authentication**
- Protected routes using **authorization middleware**
- View current user profile (`GET /users/me`)
- Update current user profile (`PATCH /users/me`)  
  – only `name` and `avatar` can be updated
- Create, view, and delete clothing items
- **Authorization check** so users can only delete **their own** items
- Passwords are **never returned** in API responses
- **CORS** enabled to allow communication with the frontend

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens)
- **bcrypt** for password hashing
- **cors** for cross-origin requests

---

## 📁 Project Structure

```bash
se_project_express/
├── app.js
├── controllers/
│   ├── clothingItems.js
│   └── users.js
├── models/
│   ├── clothingItems.js
│   └── user.js
├── routes/
│   ├── clothingItems.js
│   ├── users.js
│   └── index.js
├── middlewares/
│   └── auth.js
├── utils/
│   ├── config.js      # contains JWT_SECRET and other config values
│   ├── errors.js      # HTTP status codes and error constants
│   └── validation.js  # custom URL validation functions
├── tests/
│   └── controllers.test.js
├── package.json
└── package-lock.json
```
