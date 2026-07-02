# 📱 Ravi Mobile Gallery

<div align="center">

![Ravi Mobile Gallery](https://img.shields.io/badge/Ravi%20Mobile%20Gallery-2nd%20Hand%20Phones-1A3D63?style=for-the-badge&logo=android&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude-AI%20Powered-D97706?style=for-the-badge&logo=anthropic&logoColor=white)

**A production-ready full-stack web app built for a real 2nd hand mobile phone shop in Badnapur, Maharashtra 🇮🇳**

[🌐 Live Demo](#) • [📂 GitHub](https://github.com/niyati06-web/ravi-mobile-gallery) • [📱 WhatsApp Shop](#)

</div>

---

## ✨ What is this?

**Ravi Mobile Gallery** is a fully functional web application built for a real local mobile phone shop. Customers can browse, search, and contact the shop directly via WhatsApp — while the shop owner manages all listings through a secure admin panel.

> 🏪 Built for a real business. Used by real customers. Deployed in production.

---

## 🎯 Features

### 👤 User Side
| Feature | Description |
|--------|-------------|
| 🔐 Auth | Email/Password signup + Google OAuth login |
| 🔍 Smart Search | Voice-powered search — just speak your query |
| 🤖 AI Phone Finder | Describe your need, Claude AI suggests best matches |
| 📸 Photo Gallery | Full-screen swipeable image gallery + video preview |
| ⭐ Star Grading | Filter phones by condition & star rating |
| 💬 WhatsApp | One-click direct contact with shop owner |
| 🔑 Forgot Password | Real email reset link via Gmail |
| 🖱️ Cursor Effects | Subtle trail animation for desktop users |

### 🔐 Admin Side
| Feature | Description |
|--------|-------------|
| 🛡️ Secure Login | JWT-based auth — hidden from customer view |
| ➕ Add Listings | Add phones with photos (5 max) + video (50MB) |
| 🎙️ Voice Input | Speak phone name & price — auto-fills form |
| ✨ AI Price | Claude AI suggests fair market resale price |
| ✅ Mark Sold | Remove sold phones from customer view |
| 🗑️ Delete | Remove listings + auto-deletes uploaded files |
| 📊 Dashboard | Live stats — Listed, Sold, Inquiries |

---

## 🛠️ Tech Stack

```
Frontend          Backend           Database          AI & Services
─────────         ───────           ────────          ─────────────
React 18          Node.js           MongoDB Atlas     Claude API (Anthropic)
React Router 6    Express.js        Mongoose          Google OAuth 2.0
Context API       JWT Auth          GridFS (files)    Nodemailer (Gmail)
Web Speech API    bcrypt                              Multer (uploads)
```

---

## 🏗️ Project Structure

```
ravi-mobile-gallery/
│
├── src/                          # React Frontend
│   ├── components/
│   │   ├── Navbar.js             # Sliding side menu + user avatar
│   │   ├── PhoneCard.js          # Card with gallery modal
│   │   ├── FilterBar.js          # Brand/price/rating filters
│   │   ├── AIRequirementBox.js   # AI phone suggester
│   │   ├── BottomNav.js          # Floating pill navigation
│   │   ├── ProtectedRoute.js     # Admin route guard
│   │   └── UserRoute.js          # User route guard
│   │
│   ├── pages/
│   │   ├── AuthPage.js           # Login + Signup + Google
│   │   ├── BrowsePage.js         # Main phone listing page
│   │   ├── LoginPage.js          # Admin login
│   │   ├── ResetPasswordPage.js  # Password reset
│   │   └── admin/
│   │       ├── AdminDashboard.js # Stats + tabs
│   │       ├── AddPhone.js       # Add listing + media upload
│   │       ├── ManageListings.js # Edit/delete/sold
│   │       └── AITools.js        # Price advisor + chatbot
│   │
│   ├── context/
│   │   └── AuthContext.js        # Global auth state
│   │
│   └── App.js                    # Routes setup
│
└── backend/                      # Node.js Backend
    ├── models/
    │   ├── Phone.js              # Phone schema
    │   └── User.js               # User schema
    │
    ├── routes/
    │   ├── phones.js             # CRUD + file upload
    │   ├── auth.js               # Admin login
    │   ├── users.js              # Signup/login/Google/forgot pw
    │   └── ai.js                 # Claude AI endpoints
    │
    ├── middleware/
    │   └── authMiddleware.js     # JWT verification
    │
    └── server.js                 # Express app entry point
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Anthropic API key
- Gmail account (for password reset)

### 1️⃣ Clone the repo
```bash
git clone https://github.com/niyati06-web/ravi-mobile-gallery.git
cd ravi-mobile-gallery
```

### 2️⃣ Frontend setup
```bash
npm install
```

### 3️⃣ Backend setup
```bash
cd backend
npm install
```

### 4️⃣ Environment variables
Create `backend/.env`:
```env
# MongoDB
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ravi-mobile-gallery

# Admin credentials
ADMIN_USERNAME=ravi_admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash   # node generateHash.js yourpassword

# JWT
JWT_SECRET=your_long_random_secret_key

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Gmail (for password reset)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Shop WhatsApp
SHOP_WHATSAPP=919876543210

# Frontend URL
CLIENT_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
```

### 5️⃣ Generate admin password hash
```bash
cd backend
node generateHash.js yourpassword
# Copy the hash → paste in .env as ADMIN_PASSWORD_HASH
```

### 6️⃣ Run the app
```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd ..
npm start
```

### 7️⃣ Access
| URL | Who |
|-----|-----|
| `localhost:3000` | Customers — browse phones |
| `localhost:3000/admin/login` | Shop owner — manage listings |

---

## 🔒 Security Features

- ✅ JWT tokens with 8h expiry (admin) / 7d (users)
- ✅ bcrypt password hashing (10 salt rounds)
- ✅ Role-based access control (user vs admin)
- ✅ Admin routes completely hidden from users
- ✅ Session storage (cleared on tab close)
- ✅ File type validation on upload
- ✅ `.env` never committed to Git

---

## 📸 Screenshots

> Browse Page • Admin Panel • Gallery Modal • AI Suggestions

*Coming soon...*

---

## 🚀 Deployment

| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | Frontend hosting | Free |
| Render | Backend hosting | Free |
| MongoDB Atlas | Database | Free |
| Cloudinary | Media storage | Free |

---

## 💡 What I Learned

- Building a **full-stack MERN application** from scratch
- **JWT authentication** with role-based access control
- **File uploads** with Multer (images + video)
- Integrating **Claude AI API** for smart suggestions
- **Web Speech API** for voice search
- **Google OAuth 2.0** integration
- **Nodemailer** for transactional emails
- Deploying a full-stack app to production

---

## 👩‍💻 Developer

**Niyati Motwani**

Built as a real-world project for **Ravi Mobile Gallery**, Badnapur, Maharashtra.

> *"Real client. Real problem. Real solution."*

---

<div align="center">

Made with ❤️ using React + Node.js + MongoDB + Claude AI

⭐ Star this repo if you found it helpful!

</div>