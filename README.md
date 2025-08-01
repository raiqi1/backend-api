# Biodata Karyawan API

Backend API untuk aplikasi penyimpanan biodata calon karyawan menggunakan Node.js, Express.js, MySQL, dan Prisma.

## 🚀 Fitur

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (USER, ADMIN)
  - Sign up dan login

- **Biodata Management**
  - CRUD operations untuk biodata
  - Relasi data: Pendidikan, Pelatihan, Pekerjaan
  - User hanya bisa akses data sendiri
  - Admin bisa akses semua data

- **Security**
  - Password hashing dengan bcrypt
  - Input validation
  - CORS protection

## 📋 Prerequisites

- Node.js (v18 atau lebih baru)
- MySQL (v8.0 atau lebih baru)
- npm atau yarn

## 🛠️ Instalasi

### 1. Clone dan Setup Project

```bash
# Clone project (atau buat folder baru)
mkdir biodata-karyawan-api
cd biodata-karyawan-api

# Initialize npm project
npm init -y
```

### 2. Install Dependencies

```bash
# Production dependencies
npm install express bcryptjs jsonwebtoken cors dotenv @prisma/client express-validator multer

# Development dependencies
npm install -D nodemon prisma
```

### 3. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE biodata_karyawan;
exit;
```

### 4. Setup Environment Variables

Buat file `.env` di root folder:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/biodata_karyawan"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"
```

**⚠️ Penting:** Ganti `username` dan `password` dengan kredensial MySQL Anda!

### 5. Setup Prisma

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database (untuk development)
npx prisma db push

# Atau gunakan migrate (untuk production)
npx prisma migrate dev --name init
```

### 6. Seed Database (Opsional)

```bash
# Jalankan seeder untuk data sample
npm run db:seed
```

### 7. Update package.json

Pastikan package.json memiliki script berikut:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node src/seed.js"
  }
}
```


## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Daftar user baru |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user info |

### Biodata

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/biodata` | Buat/update biodata | USER/ADMIN |
| GET | `/api/biodata/me` | Get biodata sendiri | USER/ADMIN |
| GET | `/api/biodata/all` | Get semua biodata | ADMIN |
| GET | `/api/biodata/:id` | Get biodata by ID | ADMIN |
| DELETE | `/api/biodata/:id` | Hapus biodata | ADMIN |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API documentation |



## 🧪 Testing dengan Postman

### 1. Import Collection

- Import file `postman_collection.json` ke Postman
- Collection sudah berisi semua endpoint dengan contoh request

### 2. Test Flow

1. **Health Check** - Test koneksi server
2. **Sign Up** - Daftar user baru
3. **Login** - Login dan dapatkan JWT token
4. **Create Biodata** - Buat biodata lengkap
5. **Get My Biodata** - Lihat biodata sendiri
6. **Admin Login** - Login sebagai admin
7. **Get All Biodata** - Lihat semua biodata (admin)


## 🔐 Default Test Accounts

Jika menjalankan seeder (`npm run db:seed`):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@company.com` | `admin123` |
| User | `user@example.com` | `user123` |

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `role` (USER/ADMIN)
- `createdAt`, `updatedAt`

### Biodata Table
- `id` (Primary Key)
- `userId` (Foreign Key to Users)
- Data pribadi lengkap
- `createdAt`, `updatedAt`

### Child Tables
- `pendidikan_terakhir` (One-to-Many dengan Biodata)
- `riwayat_pelatihan` (One-to-Many dengan Biodata)
- `riwayat_pekerjaan` (One-to-Many dengan Biodata)

## 🛡️ Security Features

- **Password Hashing**: bcrypt dengan salt rounds 12
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator untuk semua input
- **Role-based Access**: USER hanya akses data sendiri, ADMIN akses semua
- **CORS Protection**: Konfigurasi CORS untuk frontend
- **SQL Injection Protection**: Prisma ORM dengan parameterized queries

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL service
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Prisma Client Error
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (HATI-HATI: akan hapus semua data)
npx prisma migrate reset
```

### JWT Token Error
- Pastikan `JWT_SECRET` di `.env` sudah diset
- Token expires dalam 7 hari, login ulang jika expired

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or change port in .env
PORT=3001
```

## 📝 Development Notes

### Project Structure
```
src/
├── config/
│   └── database.js          # Prisma client config
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── biodataController.js # Biodata CRUD logic
├── middleware/
│   ├── auth.js             # JWT auth & authorization
│   └── validators.js       # Input validation rules
├── routes/
│   ├── auth.js            # Auth routes
│   └── biodata.js         # Biodata routes
├── seed.js                # Database seeder
└── server.js              # Main application entry point

prisma/
└── schema.prisma          # Database schema definition
```

### Adding New Features

1. **New Controller**: Buat file di `src/controllers/`
2. **New Routes**: Buat file di `src/routes/` dan import di `server.js`
3. **New Middleware**: Tambahkan di `src/middleware/`
4. **Database Changes**: Update `schema.prisma` lalu run migrate

### Best Practices

- Selalu validate input menggunakan express-validator
- Gunakan transaction untuk operasi database kompleks
- Handle error dengan proper HTTP status codes
- Log semua error untuk debugging
- Gunakan environment variables untuk konfigurasi

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:port/db"
JWT_SECRET="super-secure-random-string"
PORT=3000
```

### PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name "biodata-api"

# Monitor
pm2 monit

# Auto-restart on reboot
pm2 startup
pm2 save
```

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Check troubleshooting section
2. Review error logs di console
3. Pastikan semua dependencies terinstall
4. Verify database connection dan schema

---

**Happy Coding! 🎉**