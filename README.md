# Digital Wedding Invitation Platform

A modern, scalable, and responsive digital wedding invitation web application. This project has been migrated from a legacy vanilla HTML/CSS/JS architecture to a component-based structure using React and Vite, utilizing Firebase as the backend for content management and dynamic data handling.

## Features

- **Component-Based Architecture:** Built entirely with React functional components and hooks for improved maintainability and scalability.
- **Dynamic Content Management:** Integrates with Firebase Firestore to retrieve and display customized invitation content (names, dates, locations) dynamically based on the URL parameter.
- **Interactive Forms:** Features fully functional RSVP and Guestbook forms that push data directly to the Firestore database.
- **Real-Time Data Sync:** The guestbook utilizes Firebase's real-time listeners to update the list of wishes instantly across all clients.
- **Responsive Design & Animations:** Implements a mobile-first design philosophy with custom CSS animations, utilizing the Intersection Observer API for smooth scroll-reveal effects.
- **Interactive UI Elements:** Includes integrated audio playback controls and interactive visual feedback such as a canvas-based confetti system.
- **Optimized Build Process:** Powered by Vite to ensure rapid local development and highly optimized production builds.

## Technologies Used

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Backend & Database:** Firebase (Firestore)
- **Styling:** Custom CSS with CSS Variables and Animations
- **Icons & Fonts:** FontAwesome 6, Google Fonts (Great Vibes, Playfair Display, Poppins)
- **Additional Libraries:** canvas-confetti

## Project Structure

```text
.
├── public/                 # Static assets that bypass the bundler
│   └── assets/             # Images, audio, and global static files
├── src/                    # Application source code
│   ├── components/         # Reusable React components (Cover, Quotes, RSVP, etc.)
│   ├── App.jsx             # Main application component and state management
│   ├── firebase.js         # Firebase initialization and configuration
│   ├── index.css           # Global stylesheet containing variables and animations
│   └── main.jsx            # React application entry point
├── legacy/                 # Backup of the original vanilla HTML/JS/CSS implementation
├── index.html              # Vite entry HTML file
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies and npm scripts
```

## Installation & Local Development

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dexccv/undangan.git
   cd undangan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## Build & Deployment

To compile the application for production deployment:

```bash
npm run build
```

This will generate a `dist` directory containing the minified and optimized production assets. The `dist` folder can be deployed to any static hosting service such as Vercel, Netlify, or Firebase Hosting.

## Configuration

The application expects a `couples` collection in Firestore. The specific document ID is parsed from the URL parameter (e.g., `?id=nadia-agus`). Ensure that the Firebase configuration inside `src/firebase.js` is correctly aligned with your Firebase project credentials.
