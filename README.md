# CampusSwap-Frontend
Module 3 Core Project :

An integrated South African e-commerce and home services marketplace connecting students, residents, and local service providers across South Africa.

CampusSwap ZA brings together two complementary digital platforms: 

* Academia Marketplace :
A peer-to-peer (C2C) and B2C hub where students buy, sell, and rent textbooks, laptops, stationery, and residence essentials.
 
* SafeHome ZA :
A vetted service marketplace matching students, tenants, homeowners, and property managers with verified local plumbers, electricians, cleaners, gardeners, security experts, and handymen.
  
Demo Credentials :
You can use any of these pre-seeded accounts to explore the platform. 

Role ,Email, Default Password, Lands On
1.Student
- thabo.m@myuct.ac.za
- student123
-/student-dashboard

2.Service Provider
- info@capeplumbing.co.za
- provider123
- /provider-dashboard

3.Residence Manager
- resmanager.uct@campusswap.co.za
- res123
- /resmanager-dashboard

4.Admin
- lerato.admin@campusswap.co.za
- admin123
- /admin

* Passwords are automatically upgraded to secure bcrypt hashes in the backend database upon your first successful login.If you wnat to sign in as another service provider check our db for users and use the email and the password there.

How to run the site:

- Run thses in your terminal window
1. cd frontend
2. npm install
3. npm run dev

It should show http://localhost:5173

Tech Stack used :
1. Vue & Vita
2. CSS 
3. Sweetalert
4. HTML
5. Javascript 

the backend and the database :

1. node.js
2. express 
3. mysql : database 
4. bcryptjs : auth and security

## 🔗 Live Deployment

| Component | URL |
|---|---|
| **Frontend (public link)** | https://campusswap-fontend-vnrd.onrender.com |
| Backend API | https://campusswap-backend-o0pk.onrender.com/api |
| Database | Aiven Cloud MySQL |



👥 Group Members
Name	Role

Lerato Yapi	: Project Lead & Backend architecture, Express API, MySQL schema

Anela Nqenqa: Frontend & UX .Vue interface, component library, responsive design

Siwaphiwe Boto :	Database & Backend schema, seed data, SafeHome workflow

Zaarah Okkers :	Full-Stack & Integration, frontend-backend wiring, auth, end-to-end testing

Developed with ❤️ as part of the Module 3 Core Project (September 2026).