# 🌍 Odyssey – Smart AI Travel Companion

Odyssey is a full-stack travel companion app built to help users plan, manage, and enjoy their trips with ease. It integrates essential travel tools such as trip budgeting, packing lists, monuments and restaurant planners, and even live weather forecasting – all with a clean UI and AI-powered enhancements.

---

## ✨ Features

- ✈️ **Trip Management**: Create, edit, and delete trips with automatic duration calculation.
- 🧳 **Packing List**: Add, check off, edit and delete packing items by category.
- 📍 **Map View**: Search and center on cities using Google Maps + Autocomplete.
- 🧠 **AI Suggestions**: Get smart packing ideas and budget advice using OpenAI.
- 💸 **Budget Planner**: Add categorized expenses and set total budget goals with progress tracking.
- 🏛 **Monument & Restaurant Tabs**: Organize attractions and dining plans per trip.
- 🌤 **Weather Forecasts**: Pull 7-day daily forecasts for the trip destination using [Open-Meteo](https://open-meteo.com/).
- 🔐 **Authentication**: JWT-based login/signup with secure API protection.
- 🔄 **Responsive UI**: Works beautifully across devices.

---

## 🧱 Tech Stack

### Frontend
- **React** with functional components and Hooks
- **React Router** for navigation
- **Axios** for API calls
- **CSS Modules / Custom Styles** for layout
- **Google Maps JS SDK** for geolocation + autocomplete

### Backend
- **Node.js + Express**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **RESTful APIs** for trips, packing, budgets, etc.
- **Open-Meteo API** for free weather data
- **OpenAI API** for AI-powered suggestions

---

## 📁 Folder Structure
Odyssey/
├── backend/
│   ├── config/
│   │   └── connection.js
│   ├── controllers/
│   │   ├── budgetController.js
│   │   ├── locationController.js
│   │   ├── monumentsController.js
│   │   ├── openaiController.js
│   │   ├── packingController.js
│   │   ├── restaurantsController.js
│   │   ├── tripController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   │   ├── budgetRoute.js
│   │   ├── locationRoutes.js
│   │   ├── monumentsRoute.js
│   │   ├── openaiRoute.js
│   │   ├── packingRoute.js
│   │   ├── restaurantsRoute.js
│   │   ├── tripRoute.js
│   │   └── userRoute.js
│   ├── .env
│   ├── server.js
│   └── README.md

├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── styles/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── TripHeader.jsx
│   │   │   └── TripTab.jsx
│   │   ├── pages/
│   │   │   ├── Budget.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Monuments.jsx
│   │   │   ├── PackingList.jsx
│   │   │   ├── Restaurants.jsx
│   │   │   └── Trip.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .gitignore

├── .gitignore
├── package.json
└── README.md

