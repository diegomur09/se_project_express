# WTWR (What To Wear) – Backend

This is the backend for the **WTWR – What To Wear** application.  
The server handles users, authentication, and clothing items, and exposes a REST API built with **Node.js**, **Express**, and **MongoDB**.

---


## Project Pitch Videos

Check out these videos, where I describe my project
and some challenges I faced while building it:

- [First Project Pitch Video](https://drive.google.com/file/d/1AuuGBvqa3ktCJwTUsZ8TFXhng1Mc-0TO/view?usp=sharing)
- [Full-Stack Project Pitch Video](https://drive.google.com/file/d/1f2-4lB4z0NOW_S117X3LNIJZzufis5uj/view?usp=drive_link)

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
## Deployment

- Frontend domain: https://wtrt-demo.heroinewarrior.com
- Backend API domain: https://api.wtrt-demo.heroinewarrior.com
- Frontend GitHub repository: https://github.com/diegomur09/se_project_react
- Backend GitHub repository: https://github.com/diegomur09/se_project_express
