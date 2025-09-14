#  Rating App - Roxiler Assignment  

This project is a **Rating Application** built as part of the **Roxiler Assignment**.  
It allows users to sign up, log in, and interact with a role-based dashboard (Admin, Store Owner, User).  
The backend is powered by **Express.js** with a **MySQL** database, while the frontend uses **React (Vite)** styled with **Tailwind CSS**.  

---

##  Tech Stack  

- **Frontend:** React (Vite), Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Authentication:** JWT  
- **Package Manager:** Yarn  

---

## 📂 Project Structure  

## 🛠️ Setup Steps  

1. **Clone the project**  
   ```bash
   git clone https://github.com/AnkushUdapure/advanto-coding-challange.git
   cd rating-app

2. create .env in root folder
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=rating_app
    DB_PORT=3306
    JWT_SECRET=your_jwt_secret

3. Setup MySQL database

Open MySQL

Run: CREATE DATABASE rating_app;

 mysql -u root -p rating_app < database/rating_app.sql i will share it in folder.

 4. Install dependencies
    cd back-end
    yarn install

    cd ../front-end
    yarn install

5. Run backend
    cd back-end
    yarn dev

6. Run front-end
    cd front-end
    yarn dev

7. Open in browser

    Backend: http://localhost:5000

    Frontend: http://localhost:5173

Admin: newadmin@gmail.com
Pass: Admin@25






