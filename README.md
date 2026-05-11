<p align="center">
  <img src="https://img.shields.io/badge/UniTutor-AI%20Academic%20Platform-000000?style=for-the-badge&logo=graduation-cap&logoColor=white" alt="UniTutor Badge" />
</p>

<h1 align="center">🎓 UniTutor</h1>

<p align="center">
  <strong>An AI-Powered Academic Assistance and University Management Platform</strong>
</p>

<p align="center">
  <em>Intelligent. Multi-Tenant. Enterprise-Grade.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express.js-5.2-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📖 Overview

**UniTutor** is a full-stack, multi-tenant academic SaaS platform that leverages **Google Gemini AI** to deliver intelligent, context-aware academic assistance. It connects students, faculty, and administrators across multiple universities through a unified, modern interface with real-time analytics, automated query escalation, and comprehensive academic data management.

The platform demonstrates how AI can fundamentally transform university management — from answering student queries using their actual academic records (marks, attendance, fees, schedules) to automatically escalating unresolved questions to faculty members.

---

## ✨ Key Features

### 🤖 AI-Powered Academic Tutor
- **Context-aware responses** using Google Gemini 2.5 Flash — the AI understands each student's marks, attendance, fee status, course enrollments, and university schedules
- **Intelligent query escalation** — questions the AI cannot resolve are automatically escalated to the relevant faculty member
- **Persistent chat interface** integrated directly into the student dashboard

### 🏛️ Multi-University Architecture
- **Multi-tenant design** supporting multiple universities with fully isolated data
- **Independent administration** — each university has its own admins, faculty, courses, and student body
- **Cross-platform analytics** for super administrators to monitor the entire ecosystem

### 🔐 Role-Based Access Control (RBAC)
Four distinct access tiers, each with a purpose-built dashboard:

| Role | Access Level | Key Capabilities |
|------|-------------|-------------------|
| **Super Admin** | Platform-wide | Manage all universities, view global analytics, oversee all users |
| **College Admin** | University-scoped | Manage faculty, students, courses, and university settings |
| **Faculty** | Department-scoped | View assigned courses, manage escalated queries, track student performance |
| **Student** | Personal | View academic records, interact with AI tutor, manage profile |

### 📊 Comprehensive Academic Management
- **Marks & Grades** — Exam-wise score tracking with percentage calculations and visual progress bars
- **Attendance Tracking** — Daily attendance records with status indicators (Present, Absent, Late, Excused)
- **Fee Management** — Payment tracking with due dates, amounts, and status (Paid, Pending, Overdue)
- **Course Catalog** — Detailed course information with credits, semester, department, and faculty assignment
- **University Schedules** — Academic calendar with lectures, exams, events, and festivals

### 🌐 University Community Pages
- Public-facing community pages for each university
- Browse university members, courses, departments, and statistics
- Interactive navigation between universities

---

## 🏗️ Architecture

```
UniTutor/
├── backend/                    # Node.js + Express API Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (8 models)
│   │   └── dev.db              # SQLite database
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js         # JWT authentication (login/register)
│   │   │   ├── admin.js        # College admin endpoints
│   │   │   ├── chat.js         # AI chat + query escalation
│   │   │   ├── faculty.js      # Faculty dashboard endpoints
│   │   │   ├── student.js      # Student data endpoints
│   │   │   ├── superAdmin.js   # Platform admin endpoints
│   │   │   └── university.js   # Public university data
│   │   ├── services/
│   │   │   └── ai.js           # Google Gemini AI integration
│   │   ├── prismaClient.js     # Prisma client singleton
│   │   └── server.js           # Express app entry point
│   ├── seed.js                 # Rich seed data (4 universities)
│   └── package.json
│
├── frontend/                   # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── AIPanel.jsx         # AI chat panel component
│   │   │   │   └── ChatbotBubble.jsx   # Chat bubble interface
│   │   │   └── layout/
│   │   │       ├── Layout.jsx          # App layout wrapper
│   │   │       └── Sidebar.jsx         # Navigation sidebar
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Authentication state management
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Public landing page
│   │   │   ├── Login.jsx               # Authentication page
│   │   │   ├── StudentDashboard.jsx    # Student portal
│   │   │   ├── FacultyDashboard.jsx    # Faculty portal
│   │   │   ├── AdminDashboard.jsx      # College admin portal
│   │   │   ├── SuperAdminDashboard.jsx # Platform admin portal
│   │   │   └── UniversityCommunity.jsx # University public page
│   │   ├── App.jsx             # Route configuration
│   │   ├── App.css             # Global styles & design system
│   │   └── main.jsx            # React entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8 | Component-based UI with fast HMR |
| **Routing** | React Router DOM 7 | Client-side navigation with protected routes |
| **Icons** | Lucide React | Beautiful, consistent iconography |
| **HTTP Client** | Axios | API communication |
| **Backend** | Express.js 5 | RESTful API server |
| **ORM** | Prisma 5 | Type-safe database access |
| **Database** | SQLite | Lightweight, file-based database |
| **AI Engine** | Google Gemini 2.5 Flash | Context-aware academic assistance |
| **Authentication** | JWT + bcrypt.js | Secure token-based auth with password hashing |
| **Dev Tools** | Nodemon, ESLint | Hot reload & code quality |

---

## 🗄️ Database Schema

The platform uses **8 interconnected models** designed for multi-tenant academic data management:

```
University ──┬── User (SUPER_ADMIN | ADMIN | FACULTY | STUDENT)
             ├── Course ──┬── Mark
             │            ├── Attendance
             │            ├── Schedule
             │            └── QueryEscalation
             ├── Schedule
             └── QueryEscalation

User ──┬── Course (as Faculty)
       ├── Mark (as Student)
       ├── Attendance (as Student)
       ├── FeePayment (as Student)
       └── QueryEscalation (as Student)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Google Gemini API Key** — Get one at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/vijin670/UniTutor.git
cd UniTutor
```

**2. Set up the Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-here"
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=5000
```

Initialize the database and seed sample data:

```bash
npx prisma generate
npx prisma db push
node seed.js
```

Start the backend server:

```bash
npm run dev
```

The API server will start at `http://localhost:5000`

**3. Set up the Frontend**

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

---

## 🔑 Demo Credentials

The seed data includes pre-configured accounts for testing all roles:

### Super Admin
| Email | Password |
|-------|----------|
| `superadmin@unitutor.com` | `superadmin123` |

### College Admins
| Email | Password | University |
|-------|----------|------------|
| `admin@srm.edu.in` | `password123` | SRM Institute of Science and Technology |
| `admin@sju.edu.in` | `password123` | St. Joseph's University |
| `admin@vit.ac.in` | `password123` | VIT University |
| `admin@annauniv.edu` | `password123` | Anna University |

### Faculty (Sample)
| Email | Password | Department |
|-------|----------|------------|
| `priya.cs@srm.edu.in` | `password123` | Computer Science, SRM |
| `david.cs@sju.edu.in` | `password123` | Computer Science, SJU |
| `ramesh.cs@vit.ac.in` | `password123` | Computer Science, VIT |
| `senthil.cs@annauniv.edu` | `password123` | Computer Science, Anna |

### Students (Sample)
| Email | Password | University |
|-------|----------|------------|
| `arun.kumar@srm.edu.in` | `password123` | SRM |
| `rahul.jain@sju.edu.in` | `password123` | SJU |
| `pradeep.v@vit.ac.in` | `password123` | VIT |
| `tamil.selvan@annauniv.edu` | `password123` | Anna University |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/student/dashboard` | Get complete student data |
| `PUT` | `/api/student/profile` | Update student profile |

### Faculty
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/faculty/dashboard` | Get faculty dashboard data |

### College Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard` | Get university admin data |

### Super Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/super-admin/dashboard` | Platform-wide statistics |
| `GET` | `/api/super-admin/users` | All users across universities |
| `GET` | `/api/super-admin/universities` | All university details |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message to AI tutor |

### Universities (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/universities` | List all universities |
| `GET` | `/api/universities/:id` | University community details |
| `GET` | `/api/universities/stats/global` | Global platform statistics |

---

## 🎨 Design Philosophy

UniTutor follows a **minimalist, monochrome design system** inspired by enterprise-grade SaaS platforms:

- **Black & white palette** with strategic use of semantic colors for status indicators
- **Clean typography** with tight letter-spacing and clear visual hierarchy
- **Card-based layouts** with subtle borders and consistent spacing
- **Micro-animations** including fade-ins, hover effects, and animated statistics
- **Responsive design** that adapts across desktop and tablet viewports

---

## 🏫 Supported Universities (Seed Data)

| University | Type | Location | Established |
|-----------|------|----------|-------------|
| SRM Institute of Science and Technology | Deemed | Kattankulathur, Chennai | 1985 |
| St. Joseph's University | Private | Bengaluru, Karnataka | 1882 |
| VIT University | Deemed | Vellore, Tamil Nadu | 1984 |
| Anna University | Government | Guindy, Chennai | 1978 |

---

## 🔮 Future Roadmap

- [ ] **Real-time notifications** using WebSocket integration
- [ ] **Assignment submission** portal with deadline tracking
- [ ] **Discussion forums** per course with threaded conversations
- [ ] **Mobile-responsive** PWA with offline support
- [ ] **Advanced analytics** with exportable PDF reports
- [ ] **Multi-language support** for regional accessibility
- [ ] **PostgreSQL migration** for production scalability
- [ ] **File uploads** for assignments, notes, and resources
- [ ] **Video conferencing** integration for online classes
- [ ] **Attendance QR codes** for automated class check-ins

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vijin Raj**

- GitHub: [@vijin670](https://github.com/vijin670)

---

<p align="center">
  <strong>Built with ❤️ for modern education</strong>
</p>

<p align="center">
  <em>UniTutor — Where AI meets Academia</em>
</p>
