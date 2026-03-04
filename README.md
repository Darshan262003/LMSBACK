# LMS Backend - Learning Management System

A complete production-ready backend for a Learning Management System built with Node.js, Express, TypeScript, MySQL, and Prisma ORM.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Access tokens (15 min expiry)
  - Refresh tokens (30 days, stored in DB + HTTP-only cookies)
  - Bcrypt password hashing
  - Token revocation on logout

- **Subject Management**
  - Browse published subjects
  - Search and pagination
  - Full subject tree structure with sections and videos
  - Video lock/unlock status based on completion

- **Video Management**
  - Sequential video unlocking
  - Navigation between videos
  - YouTube iframe support
  - Previous/next video tracking

- **Progress Tracking**
  - Track video watch progress
  - Mark videos as completed
  - Subject-level progress statistics
  - Resume from last position

- **Security**
  - CORS enabled for frontend domain
  - Helmet middleware for HTTP headers
  - Rate limiting (stricter on auth endpoints)
  - Input validation on all requests
  - Global error handling

## 📁 Project Structure

```
LMSBE/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── server.ts                   # Server entry point
│   ├── config/
│   │   ├── env.ts                  # Environment configuration
│   │   ├── db.ts                   # Prisma client setup
│   │   └── security.ts             # CORS, helmet, rate limiting
│   ├── modules/
│   │   ├── auth/                   # Authentication module
│   │   ├── users/                  # User module
│   │   ├── subjects/               # Subject management
│   │   ├── sections/               # Section management
│   │   ├── videos/                 # Video management
│   │   ├── progress/               # Progress tracking
│   │   └── health/                 # Health check
│   ├── middleware/
│   │   ├── authMiddleware.ts       # JWT verification
│   │   ├── errorHandler.ts         # Global error handler
│   │   └── requestLogger.ts        # Request logging
│   ├── utils/
│   │   ├── jwt.ts                  # Token utilities
│   │   ├── password.ts             # Password hashing
│   │   └── ordering.ts             # Order utilities
│   └── types/
│       └── express.d.ts            # Type definitions
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── seed.ts                     # Seed data
│   └── migrations/                 # Database migrations
├── .env                            # Environment variables
├── .env.example                    # Example environment
├── package.json
├── tsconfig.json
└── render.yaml                     # Render deployment config
```

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Security:** helmet, cors, express-rate-limit

## 📋 API Endpoints

### Health Check

```http
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "All systems operational",
  "data": {
    "status": "OK",
    "database": "connected",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<token>
```

#### Logout
```http
POST /api/auth/logout
Cookie: refreshToken=<token>
```

### Subjects

#### List Subjects
```http
GET /api/subjects?page=1&pageSize=10&q=search-term
```

#### Get Subject Details
```http
GET /api/subjects/:subjectId
```

#### Get Subject Tree (with unlock status)
```http
GET /api/subjects/:subjectId/tree
Authorization: Bearer <access_token>
```

### Videos

#### Get Video Details
```http
GET /api/videos/:videoId
Authorization: Bearer <access_token>
```

Response includes:
- Video metadata
- Section and subject info
- Previous/next video IDs
- Lock status

#### Get First Video
```http
GET /api/subjects/:subjectId/first-video
```

### Progress

#### Get Subject Progress
```http
GET /api/progress/subjects/:subjectId
Authorization: Bearer <access_token>
```

Response:
```json
{
  "success": true,
  "data": {
    "totalVideos": 10,
    "completedVideos": 5,
    "percentComplete": 50,
    "lastVideoId": 123,
    "lastPositionSeconds": 120
  }
}
```

#### Get Video Progress
```http
GET /api/progress/videos/:videoId
Authorization: Bearer <access_token>
```

#### Update Video Progress
```http
POST /api/progress/videos/:videoId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "lastPositionSeconds": 120,
  "isCompleted": true
}
```

## 🔐 Authentication Flow

1. **Register/Login** → Receive access token + refresh token cookie
2. **Access protected routes** → Send `Authorization: Bearer <token>`
3. **Token expires (15 min)** → POST to `/api/auth/refresh`
4. **Logout** → Revoke refresh token, clear cookie

## 🎥 Video Unlock Logic

Videos unlock sequentially:
- First video is always unlocked
- Next video unlocks only when previous video is marked as completed
- Lock status included in all video-related responses

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `subjects` - Course subjects (JAVA, PYTHON, JAVASCRIPT)
- `sections` - Subject sections with unique (subject_id, order_index)
- `videos` - Videos with YouTube URLs
- `enrollments` - User-subject enrollments
- `video_progress` - Video watch progress
- `refresh_tokens` - JWT refresh tokens

### Initial Data
The database is seeded with:
- **JAVA**: 4 sections, 6 videos
- **PYTHON**: 4 sections, 4 videos
- **JAVASCRIPT**: 4 sections, 4 videos

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Generate Prisma client**
```bash
npx prisma generate
```

4. **Run migrations**
```bash
npx prisma migrate dev
```

5. **Seed database**
```bash
npx prisma db seed
```

6. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:8080`

## 📦 Available Scripts

```bash
npm run dev          # Development with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:seed       # Seed database
```

## 🌐 Deployment (Render)

1. Push code to Git repository
2. Connect repository to Render
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `REFRESH_SECRET`
   - `FRONTEND_URL`
   - `COOKIE_DOMAIN`

4. Deploy using `render.yaml` configuration

Build command:
```bash
npm install; npm run build; npx prisma generate; npx prisma migrate deploy
```

Start command:
```bash
npm start
```

## 🔒 Security Considerations

- All passwords hashed with bcrypt (10 salt rounds)
- JWT secrets must be strong and unique
- Refresh tokens stored as SHA-256 hashes in DB
- HTTP-only cookies prevent XSS attacks
- Rate limiting prevents brute force attacks
- CORS restricts cross-origin requests
- Helmet sets secure HTTP headers

## 📝 Notes

- The backend expects a frontend running on `http://localhost:3000` by default
- YouTube URLs are placeholders - replace with actual video URLs
- Cookie domain should match your frontend domain in production
- All timestamps are in UTC

## 🐛 Troubleshooting

**Database connection errors:**
- Verify DATABASE_URL format
- Ensure MySQL is running
- Check SSL mode requirements

**Prisma errors:**
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` for new migrations

**Authentication issues:**
- Verify JWT_SECRET and REFRESH_SECRET match
- Check cookie domain settings
- Ensure clock skew isn't causing token expiration issues

## 📄 License

ISC
#   L M S B A C K  
 