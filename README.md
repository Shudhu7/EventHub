# 🎟️ EventHub - Frontend

**EventHub** is a full-stack event booking platform where users can discover, browse, and book events like concerts, seminars, and workshops.

This repository contains the **frontend** built using **React + Vite**, which connects to a Spring Boot backend API.

---

## 🚀 Features

- List upcoming events
- Filter and search events
- Book tickets for events
- User login and registration
- Admin UI for managing events
- Integration with backend APIs (Spring Boot)

---

## 🛠️ Tech Stack

- ⚛️ React (with Vite)
- 📦 Axios (API communication)
- 🔄 React Router (navigation)
- 🎨 Tailwind CSS or Bootstrap (styling)
- 🔐 JWT Auth (via backend)

---

## 📦 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Shudhu7/EventHub.git
cd EventHub

2️⃣ Install dependencies
npm install

3️⃣ Start the development server
npm run dev

Your app will be running at: http://localhost:5173

Note: Vite runs on port 5173 by default.


📁 Folder Structure
src/
├── components/      # Shared React components (Navbar, EventCard, etc.)
├── pages/           # Page views (Home, Login, Register, Dashboard)
├── services/        # Axios API logic
├── App.jsx          # Root component
├── main.jsx         # Entry point
└── index.css        # Global styles

🧪 Scripts
npm run dev       # Run dev server (Vite)
npm run build     # Build for production
npm run preview   # Preview production build


