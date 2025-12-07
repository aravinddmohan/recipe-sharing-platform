# Recipe Sharing Platform

A full-stack Recipe Sharing platform built with React (frontend) and Django + MySQL (backend), where users can explore recipes, manage their own creations, and access admin-powered insights.

---

##  Features

### User Features
- User authentication (Sign up / Login)
- Create, edit, and delete recipes
- View personal recipes dashboard
- Change password
- View individual recipe details

###  Admin Features
- Admin dashboard
- View users
- Block / Unblock users
- Track most viewed recipes
- View user activity history

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- JavaScript

### Backend
- Django
- Django REST Framework
- MySQL

---

## Project Structure

recipe-sharing-platform/
│
├── Frontend/
│   └── recipe-share/
│
├── Backend/
│   └── backend_recipe/
│
└── .gitignore

---

## Setup Guide

### Clone the Repository

git clone https://github.com/aravinddmohan/recipe-sharing-platform
cd recipe-sharing-platform

---

### Frontend Setup

cd Frontend/recipe-share
npm install
npm start

Frontend will run at:
http://localhost:3000

---

### Backend Setup

cd Backend/backend_recipe
pip install -r requirements.txt
python manage.py runserver

Backend will run at:
http://127.0.0.1:8000

Ensure MySQL is running and configured in Django settings.

---

## 🛡 Security Practices

- .env files are excluded
- Passwords & DB secrets are not stored in repo
- node_modules, media & db.sqlite3 are ignored
- Git hygiene enforced via .gitignore

---

## Future Enhancements
- Recipe likes & ratings

---

## Author

Aravind Mohan  
GitHub: https://github.com/aravinddmohan

---

##  License

This project is for educational and portfolio use.
