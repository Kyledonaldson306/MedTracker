# MedTracker
A full-stack web application for personal medication management built with React and Node.js.

## 🚀 Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Medication Management**: Add, edit, and delete medications with dosage information
- **Schedule Tracking**: View daily medication schedules with time-based status indicators
- **Smart Time Display**: Automatically shows if medication times are past, current, or upcoming
- **Login Streak Calendar**: Track your consistency with a visual calendar showing login streaks
- **Badges & Achievements**: Earn badges for milestones and consistent medication tracking
- **Notifications**: In-app notification system for medication reminders and updates
- **Medical News**: Stay informed with a curated medical news feed
- **Clean UI**: Modern, responsive design with an intuitive user interface
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality

## 🛠️ Tech Stack
**Frontend:**
- React 18
- React Router for navigation
- Axios for API requests
- Modern CSS with responsive design

**Backend:**
- Node.js
- Express.js
- SQLite database
- RESTful API architecture
- JWT authentication

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Kyledonaldson306/MedTracker.git
cd MedTracker
```

### 2. Set up the Backend
```bash
cd backend
npm install
npm run dev
```
The backend server will start on `http://localhost:3001`

### 3. Set up the Frontend
Open a new terminal window/tab:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## 📱 Usage
1. **Create an Account**: Register with a username, email, and password to get started
2. **Log In**: Sign in to access your personal medication dashboard
3. **Add a Medication**: Click "Add New Medication" and fill in the details including name, dosage, frequency, and times
4. **View Schedule**: Click "View Today's Schedule" to see all medications organized by time
5. **Edit Medication**: Click "Edit" on any medication card to update its information
6. **Delete Medication**: Click "Delete" to remove a medication (with confirmation)
7. **Track Your Streak**: View your login streak calendar to stay motivated and consistent
8. **Earn Badges**: Hit milestones to unlock achievement badges
9. **Stay Notified**: Check the notifications panel for reminders and updates
10. **Read Medical News**: Browse the latest medical news directly from your dashboard

## 🗂️ Project Structure
```
MedTracker/
├── backend/
│   ├── database.js          # Database configuration and initialization
│   ├── server.js            # Express server and API routes
│   ├── medtracker.db        # SQLite database (auto-generated)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── MedicalNews.jsx  # Medical news feed component
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx     # Dashboard with streak calendar & badges
│   │   │   ├── Login.jsx    # User login page
│   │   │   ├── Register.jsx # User registration page
│   │   │   ├── AddMedication.jsx
│   │   │   ├── EditMedication.jsx
│   │   │   ├── Schedule.jsx
│   │   │   └── Badges.jsx   # Achievements and badges page
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main app component with routing
│   │   └── App.css          # Styles
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

**Medications**
- `GET /api/medications` - Get all medications
- `GET /api/medications/:id` - Get a specific medication
- `POST /api/medications` - Create a new medication
- `PUT /api/medications/:id` - Update a medication
- `DELETE /api/medications/:id` - Delete a medication
- `GET /api/schedule/today` - Get today's medication schedule

**Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive a JWT token

**User & Gamification**
- `GET /api/user/badges` - Get earned badges for the current user
- `GET /api/user/streak` - Get login streak data

## 🎯 Future Enhancements
- Medication history tracking and adherence statistics
- Push notifications for medication reminders
- Export medication list to PDF
- Mobile app version
- Integration with pharmacy APIs

## 👨‍💻 Developer
**Kyle Donaldson**
- GitHub: [@Kyledonaldson306](https://github.com/Kyledonaldson306)

## 📄 License
This project is licensed under the MIT License.

## 🙏 Acknowledgments
Built as a portfolio project to demonstrate full-stack web development skills with modern JavaScript technologies.
