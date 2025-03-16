# Cinema-Ticket-Reservation-node-js

# 🎬 Cinema Ticket Reservation API

A RESTful API for managing movie reservations, built with **Node.js, Express, Sequelize, and PostgreSQL**.

## 🚀 Features

✅ Manage movies and showtimes  
✅ Reserve seats with concurrency handling  
✅ Validate reservation time before cancellation  
✅ Use JWT for authentication

---

## 📌 1. Installation and Setup

### **1.1. Prerequisites**

-   **Node.js**
-   **PostgreSQL**
-   **Git**

### **1.2. Clone the Repository and Install Dependencies**

```bash
git clone https://github.com/your-repo/movie-reservation.git
cd movie-reservation
npm install
```

### **1.3. Environment Variables (.env File)**

-   Step 1: Create a .env file in the root directory of your project.
-   Step 2: Configure your database settings in the .env file. You can use the sample.env file provided in this Git repository as a reference template.

### **1.4. Start the Project**

#### 🎯 **1. Start the Database**

Ensure your PostgreSQL database is running and apply migrations:

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

#### 🎯 **2. Start the Server**

```bash
npm run dev
```

✅ The API will be available at `http://localhost:3000`.

---

## 📌 2. API Endpoints

| Method | Endpoint                    | Description                                          | Auth Required |
| ------ | --------------------------- | ---------------------------------------------------- | ------------- |
| GET    | `/`                         |                                                      | ❌            |
| POST   | `/api/users/register`       | Register a new user                                  | ❌            |
| POST   | `/api/users/login`          | User login                                           | ❌            |
| GET    | `/api/movies`               | Retrieve a list of movies                            | ❌            |
| POST   | `/api/movies`               | Add a new movie (Admin only)                         | ✅            |
| DELETE | `/api/movies/:id`           | Delete a movie (Admin only)                          | ✅            |
| GET    | `/api/movies/:id`           | Retrieve a Movie Details                             | ❌            |
| GET    | `/api/movies/genre/:genre`  | Retrieve movies by genre                             | ❌            |
| POST   | `/api/showtimes`            | Add a new showtime for a specific movie (Admin only) | ✅            |
| GET    | `/api/showtimes/:id`        | Retrieve a list of showtime for a specific movie     | ❌            |
| DELETE | `/api/showtimes/:id`        | Delete a showtime for a specific movie (Admin only)  | ✅            |
| GET    | `/api/showtimes/time/:time` | Retrieve a list of showtime by time                  | ❌            |
| GET    | `/api/showtimes/date/:date` | Retrieve a list of showtime by date                  | ❌            |
| POST   | `/api/seats`                | Add a new seats for a specific showtime (Admin only) | ✅            |
| GET    | `/api/seats/showtime/:id`   | Get available seats for a showtime                   | ❌            |
| DELETE | `/api/seats/showtime/:id`   | Delete a seats for a specific showtime (Admin only)  | ✅            |
| POST   | `/api/reservations`         | Reserve a seat                                       | ✅            |
| GET    | `/api/reservations/:id`     | Retrieve a reservation Details                       | ✅            |
| DELETE | `/api/reservations/:id`     | Cancel a reservation                                 | ✅            |

---

## 📌 3. Testing the API with Postman

1. **Install Postman**: Download from [Postman](https://www.postman.com/downloads/).
2. **Import API Documentation (`cinema.postman_collection.json`)**.
3. **Test the `GET /` endpoint**.

---

## **✅ Importing API Documentation in Postman**

1. **Open Postman**
2. **Click "Import"**
3. **Select `cinema.postman_collection.json`**
4. **Click "Run" to test the API**
