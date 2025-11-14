

# 💼 CareerConnect

### *By Team DIU_TeamGittu*

---

## 🌟 Overview

**CareerConnect** is a modern, full-stack web application designed to bridge the gap between **education and employment**.

It connects **students**, **graduates**, and **job seekers** with **relevant job opportunities** and **learning resources** tailored to their skills and career aspirations.

---

## 🧠 Tech Stack

### 🖥️ Frontend

* ⚛️ **React** – A JavaScript library for building user interfaces.
* 🧩 **TypeScript** – For static typing and cleaner code.
* 🧭 **React Router** – For client-side routing.
* 🎨 **Tailwind CSS** – A utility-first CSS framework for styling.

### ⚙️ Backend

* 🟩 **Node.js & Express.js** – For RESTful API development.
* 🗃️ **MySQL (via XAMPP)** – Relational database for user data.
* 🔒 **JWT (JSON Web Tokens)** – For secure authentication.
* 🧂 **Bcrypt** – For password hashing and encryption.

---

## 🚀 Getting Started

Follow these steps to set up **CareerConnect** on your local machine.

---

## 🧩 Stage 1: Prerequisites (Install Required Software)

Before running the project, make sure you have the following installed:

### 1️⃣ Code Editor

Use **Visual Studio Code (VS Code)** – it’s free, powerful, and beginner-friendly.
➡️ [Download VS Code](https://code.visualstudio.com/)

### 2️⃣ Node.js & npm

Node.js runs your backend server, and npm manages dependencies.
➡️ [Download Node.js (LTS version)](https://nodejs.org/en/download/)

To verify installation:

```bash
node -v
npm -v
```

### 3️⃣ MySQL Database Server (via XAMPP)

XAMPP provides an easy way to manage your local MySQL database.
➡️ [Download XAMPP](https://www.apachefriends.org/download.html)

---

## 🗄️ Stage 2: Set Up the Database

### 1️⃣ Start MySQL

* Open **XAMPP Control Panel**
* Click **Start** next to *MySQL* (it should turn green)

### 2️⃣ Open phpMyAdmin

* In XAMPP, click **Admin** next to *MySQL*
* This opens **phpMyAdmin** in your browser

### 3️⃣ Create a Database

1. Go to the **Databases** tab
2. Enter database name: `career_connect_db`
3. Choose **utf8mb4_general_ci** collation
4. Click **Create**

### 4️⃣ Import Table Structure

1. Click the `career_connect_db` database
2. Open the **SQL** tab
3. Copy the SQL code from:

   ```
   mysql-backend/database.sql
   ```
4. Paste into phpMyAdmin’s SQL window
5. Click **Go**

✅ If successful, you’ll see a new `users` table inside your database.

---

## ⚙️ Stage 3: Configure the Backend

### 1️⃣ Open the Project

Open your project folder in **VS Code**.

### 2️⃣ Create an `.env` File

Inside the `mysql-backend` folder:

* Find `.env.example`
* Create a **new file** named `.env`
* Copy everything from `.env.example` into `.env`

### 3️⃣ Update Database Configuration

Update your `.env` file with the following (for XAMPP defaults):

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=career_connect_db

# JWT Secret Key
JWT_SECRET=a-very-secret-and-long-key-for-jwt
```

💡 *Note:* The default MySQL username for XAMPP is `root`, and it usually has **no password**.

---

## ✨ Stage 4: Configure the Frontend (API Key)

The AI-powered **Career Roadmap** feature uses the Google Gemini API. To enable it, you need to provide an API key. This step is optional if you don't need the AI roadmap generation.

### 1️⃣ Get Your API Key

1.  Go to **Google AI Studio**: ➡️ [makersuite.google.com](https://makersuite.google.com/)
2.  Click **"Get API key"** and create a new key.

### 2️⃣ Create a `.env` File for the Frontend

*   In the **root folder** of the project (the same level as `vite.config.ts`), create a new file named `.env`.
*   This is different from the `.env` file inside the `mysql-backend` folder.

### 3️⃣ Add Your API Key

*   Open the new `.env` file and add the following line, replacing `your_google_api_key_here` with the key you just created.

```env
# Google Gemini API Key
API_KEY="your_google_api_key_here"
```

✅ After saving, the frontend will be able to connect to the Gemini API. You may need to restart the development server if it's already running.

---

## 🧠 Stage 5: Run the Backend Server

### 1️⃣ Open a Terminal in VS Code

Click `Terminal > New Terminal` from the top menu.

### 2️⃣ Navigate to Backend Folder

```bash
cd mysql-backend
```

### 3️⃣ Install Dependencies

```bash
npm install
```

(You only need to do this once.)

### 4️⃣ Start the Server

```bash
npm start
```

If everything is set up correctly, you’ll see:

```
Server running on http://localhost:3001
```

✅ Leave this terminal **open** — it’s running your backend.

---

## 💻 Stage 6: Run the Frontend Application

### 1️⃣ Open a New Terminal

In VS Code, click the **+** icon to open a new terminal.
(Keep the backend terminal running.)

### 2️⃣ Navigate to Project Root

If you’re inside `mysql-backend`, go up one level:

```bash
cd ..
```

### 3️⃣ Install Frontend Dependencies

```bash
npm install
```

### 4️⃣ Start the Frontend

```bash
npm run dev
```

You’ll see something like:

```
VITE v5.x.x  ready in 500ms
➜  Local: http://localhost:5173/
```

Ctrl+Click (Windows) or Cmd+Click (Mac) to open the link.

🎉 You should now see the **CareerConnect Login Page** in your browser!

---

## 🌐 URLs Summary

| Service    | Default URL                                                |
| ---------- | ---------------------------------------------------------- |
| Frontend   | [http://localhost:5173](http://localhost:5173)             |
| Backend    | [http://localhost:3001](http://localhost:3001)             |
| phpMyAdmin | [http://localhost/phpmyadmin](http://localhost/phpmyadmin) |

---

## 🧑‍💻 Contributors

👥 **Team DIU_TeamGittu** Sourabh Barua, Mahmudul Alam Rifat, Thalha Ahmed alvi

> *Building bridges between education and employment through technology.*

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.