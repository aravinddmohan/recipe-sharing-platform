# Recipe Sharing Platform
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![DjangoREST](https://img.shields.io/badge/DRF-ff1709?style=for-the-badge&logo=django&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---
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

## Security Practices

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
