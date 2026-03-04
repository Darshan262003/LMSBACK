# Testing LMS Backend with Postman

## 📋 Prerequisites

1. Make sure the backend server is running on `http://localhost:8080`
2. Install Postman (desktop app or use web version at https://web.postman.co)

---

## 🔧 Step-by-Step Testing Guide

### 1️⃣ Health Check (Test if server is running)

**Request:**
```
GET http://localhost:8080/api/health
```

**Expected Response:**
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

---

### 2️⃣ Register a New User

**Request:**
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
```

**⚠️ Important:** Save the `accessToken` from the response - you'll need it for authenticated requests!

---

### 3️⃣ Login (Alternative to registration)

**Request:**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:** Same as registration (includes accessToken)

---

### 4️⃣ Browse Subjects (No authentication required)

**Request:**
```
GET http://localhost:8080/api/subjects?page=1&pageSize=10
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Java Programming",
      "slug": "java",
      "description": "Complete Java course from basics to advanced concepts",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "title": "Python Programming",
      "slug": "python",
      ...
    },
    {
      "id": "3",
      "title": "JavaScript Development",
      "slug": "javascript",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

**Search for subjects:**
```
GET http://localhost:8080/api/subjects?q=java
```

---

### 5️⃣ Get Subject Details (No authentication)

**Request:**
```
GET http://localhost:8080/api/subjects/1
```

**Expected Response:** Subject metadata

---

### 6️⃣ Get Subject Tree WITH Authentication

This shows sections, videos, and their unlock status.

**Setup in Postman:**
1. Go to the **Authorization** tab
2. Type: **Bearer Token**
3. Token: Paste your `accessToken` from login/register

**Request:**
```
GET http://localhost:8080/api/subjects/1/tree
Authorization: Bearer <your-access-token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Java Programming",
    "sections": [
      {
        "id": "1",
        "title": "Introduction to Java",
        "orderIndex": 1,
        "videos": [
          {
            "id": "1",
            "title": "Welcome to Java Course",
            "durationSeconds": 300,
            "isLocked": false,
            "isCompleted": false
          },
          {
            "id": "2",
            "title": "Setting Up Java Environment",
            "durationSeconds": 420,
            "isLocked": true,
            "isCompleted": false
          }
        ]
      }
    ]
  }
}
```

---

### 7️⃣ Get First Video of a Subject

**Request:**
```
GET http://localhost:8080/api/subjects/1/first-video
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "1"
  }
}
```

---

### 8️⃣ Get Video Details (Requires authentication)

**Setup:** Authorization → Bearer Token

**Request:**
```
GET http://localhost:8080/api/videos/1
Authorization: Bearer <your-access-token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Welcome to Java Course",
    "description": "Introduction to the Java programming language and course overview",
    "youtubeUrl": "https://www.youtube.com/watch?v=eIrMbAQSU34",
    "durationSeconds": 300,
    "sectionId": "1",
    "sectionTitle": "Introduction to Java",
    "subjectId": "1",
    "subjectTitle": "Java Programming",
    "previousVideoId": null,
    "nextVideoId": "2",
    "isLocked": false
  }
}
```

---

### 9️⃣ Get Your Progress in a Subject

**Setup:** Authorization → Bearer Token

**Request:**
```
GET http://localhost:8080/api/progress/subjects/1
Authorization: Bearer <your-access-token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalVideos": 10,
    "completedVideos": 0,
    "percentComplete": 0,
    "lastVideoId": "1",
    "lastPositionSeconds": 0
  }
}
```

---

### 🔟 Get Progress for Specific Video

**Setup:** Authorization → Bearer Token

**Request:**
```
GET http://localhost:8080/api/progress/videos/1
Authorization: Bearer <your-access-token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "lastPositionSeconds": 0,
    "isCompleted": false
  }
}
```

---

### 1️⃣1️⃣ Update Video Progress

**Setup:** Authorization → Bearer Token

**Request:**
```
POST http://localhost:8080/api/progress/videos/1
Content-Type: application/json
Authorization: Bearer <your-access-token>

{
  "lastPositionSeconds": 120,
  "isCompleted": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "id": "1",
    "userId": "1",
    "videoId": "1",
    "lastPositionSeconds": 120,
    "isCompleted": true,
    "completedAt": "2024-01-01T00:00:00.000Z",
    ...
  }
}
```

**💡 Pro Tip:** After marking video 1 as completed, video 2 will automatically unlock!

---

### 1️⃣2️⃣ Refresh Access Token

When your access token expires (15 minutes), use the refresh endpoint.

**Note:** The refresh token is stored in an HTTP-only cookie, so you need to have logged in recently.

**Request:**
```
POST http://localhost:8080/api/auth/refresh
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1️⃣3️⃣ Logout

**Request:**
```
POST http://localhost:8080/api/auth/logout
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🎯 Complete Testing Workflow

Here's a recommended order to test all features:

1. ✅ **Health Check** - Verify server is running
2. ✅ **Register** - Create a new user account
3. ✅ **Browse Subjects** - See available courses
4. ✅ **Get Subject Tree** - View JAVA course structure
5. ✅ **Get First Video** - Get video ID 1
6. ✅ **Get Video Details** - See video info and unlock status
7. ✅ **Update Progress** - Mark video 1 as completed (120 seconds)
8. ✅ **Check Subject Progress** - See your overall progress
9. ✅ **Get Subject Tree Again** - Notice video 2 is now unlocked!
10. ✅ **Get Next Video** - Access video 2 details

---

## 🔐 Setting Up Authorization in Postman

### Method 1: Per Request
1. Open any request that requires authentication
2. Go to **Authorization** tab
3. Type: **Bearer Token**
4. Token: Paste your access token

### Method 2: Collection Variable (Recommended)
1. Create a new collection in Postman
2. Go to collection **Variables** tab
3. Add variable: `access_token`
4. After logging in, save token: 
   ```javascript
   // In Tests tab of login request
   const json = pm.response.json();
   pm.collectionVariables.set('access_token', json.data.accessToken);
   ```
5. In Authorization tab of other requests, use: `{{access_token}}`

### Method 3: Automatic Token Saving
Add this to the **Tests** tab of your login/register requests:
```javascript
// Save token automatically
const json = pm.response.json();
if (json.data && json.data.accessToken) {
    pm.collectionVariables.set('access_token', json.data.accessToken);
    console.log('✅ Access token saved:', json.data.accessToken);
}
```

Then in all authenticated requests:
- Authorization type: Bearer Token
- Token: `{{access_token}}`

---

## 📦 Import Ready Collection

You can import this directly into Postman:

```json
{
  "info": {
    "name": "LMS Backend API"
  },
  "variable": [
    {
      "key": "access_token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/health"
      }
    },
    {
      "name": "Register User",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "const json = pm.response.json();",
              "if (json.data && json.data.accessToken) {",
              "    pm.collectionVariables.set('access_token', json.data.accessToken);",
              "    console.log('✅ Token saved');",
              "}"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"Test User\"\n}"
        },
        "url": "http://localhost:8080/api/auth/register"
      }
    },
    {
      "name": "Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "const json = pm.response.json();",
              "if (json.data && json.data.accessToken) {",
              "    pm.collectionVariables.set('access_token', json.data.accessToken);",
              "}"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": "http://localhost:8080/api/auth/login"
      }
    },
    {
      "name": "List Subjects",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/subjects?page=1&pageSize=10"
      }
    },
    {
      "name": "Get Subject Tree",
      "request": {
        "method": "GET",
        "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
        "url": "http://localhost:8080/api/subjects/1/tree"
      }
    },
    {
      "name": "Get Video Details",
      "request": {
        "method": "GET",
        "header": [{ "key": "Authorization", "value": "Bearer {{access_token}}" }],
        "url": "http://localhost:8080/api/videos/1"
      }
    },
    {
      "name": "Update Video Progress",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Authorization", "value": "Bearer {{access_token}}" },
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"lastPositionSeconds\": 120,\n  \"isCompleted\": true\n}"
        },
        "url": "http://localhost:8080/api/progress/videos/1"
      }
    }
  ]
}
```

**To import:**
1. Copy the JSON above
2. In Postman, click **Import**
3. Select **Raw text**
4. Paste and click **Continue** → **Import**

---

## 🐛 Common Issues & Solutions

### ❌ "401 Unauthorized"
**Solution:** 
- Check if access token is expired (15 min lifetime)
- Re-login to get new token
- Make sure Bearer token is set correctly

### ❌ "400 Bad Request"
**Solution:**
- Check Content-Type header is `application/json`
- Verify JSON body format
- Ensure required fields are present

### ❌ "Cannot connect to server"
**Solution:**
- Verify server is running on port 8080
- Check terminal for errors
- Restart server: `npm run dev`

### ❌ "Database disconnected"
**Solution:**
- Database credentials may be incorrect
- MySQL server might be offline
- Check network connection to Aiven Cloud

---

## 🎨 Postman Tips

1. **Use Collections** - Organize endpoints by feature
2. **Environment Variables** - Store tokens, base URLs
3. **Pre-request Scripts** - Auto-refresh tokens
4. **Test Scripts** - Validate responses automatically
5. **History** - Quickly re-run recent requests

---

## ✅ Quick Start (5 minutes)

1. Start server: `npm run dev`
2. Open Postman
3. Import the collection above OR manually:
   - GET `/api/health` → Verify server
   - POST `/api/auth/register` → Create user
   - GET `/api/subjects` → Browse courses
   - GET `/api/subjects/1/tree` → View structure (use Bearer token!)
   - POST `/api/progress/videos/1` → Update progress

That's it! You're now testing the LMS backend like a pro! 🚀
