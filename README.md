# ShopSphere

A full-stack e-commerce application built with **Angular** (Frontend) and **ASP.NET Core** (Backend), using **PostgreSQL** as the database.

---

## 🛠 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [.NET SDK](https://dotnet.microsoft.com/download) (Version 8+)
- [PostgreSQL](https://www.postgresql.org/download/)

---

## 🚀 Getting Started

### 1. Database Configuration
1. Ensure PostgreSQL is running.
2. Create a database named `ShopSphere`.
3. Open `backend/appsettings.json` and update the `DefaultConnection` string with your PostgreSQL password:
   ```json
   "DefaultConnection": "Host=localhost;Port=5432;Database=ShopSphere;Username=postgres;Password=<YOUR_PASSWORD>"
   ```

### 2. Backend Setup (.NET)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
4. Start the backend server:
   ```bash
   dotnet run
   ```
   *The API will be available at http://localhost:5000 (or as configured in logs).*

### 3. Frontend Setup (Angular)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *The application will be available at http://localhost:4200.*

---

## 🔧 Troubleshooting

- **Angular Config**: Ensure `angular.json` is located in the `frontend/` root directory, not inside `src/`.
- **Missing Imports**: If you encounter errors with `ngModel` in components like `LoginComponent`, verify that the component is standalone and imports `FormsModule`.
- **Database Connection**: If the backend fails to start, verify your PostgreSQL service is running and the database `ShopSphere` exists.

---

## 📜 Project Structure

- `backend/`: ASP.NET Core Web API with Entity Framework Core.
- `frontend/`: Angular application with standalone components and Vite-based build system.
