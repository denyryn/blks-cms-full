# Laravel API

A simple Laravel API project.

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Install dependencies

```bash
composer install
```

### 2. Copy env file

```bash
cp .env.example .env
```

### 3. Generate application key

```bash
php artisan key:generate
```

### 4. Run database migrations

```bash
php artisan migrate
```

### 5. (Optional) Seed the database

```bash
php artisan db:seed
```

### 6. Start the development server

```bash
php artisan serve
```

The application will be available at:

```
http://127.0.0.1:8000
```

---

## 🔗 API Endpoints Sample

### Authentication

* **Login**: `POST /api/auth/login`

  * Parameters: `email`, `password`

* **Register**: `POST /api/auth/register`

  * Parameters: `email`, `password`, `password_confirmation`

### Products

* **Products Resource**: `/api/products`

  * Fields: `id`, `name`, `description`, `image_url`, `price`
  * Standard CRUD operations available (GET, POST, PUT/PATCH, DELETE)

---

## ⚙️ Requirements

* PHP >= 8.0
* Composer
* MySQL or any supported database

---

## 📌 Notes

* Ensure your `.env` file is properly configured (DB connection, APP\_URL, etc.) before running migrations.
* You can stop the server anytime with `CTRL+C`.
