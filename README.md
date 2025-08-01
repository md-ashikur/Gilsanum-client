
# Gilsanum Platform

This project is a full-stack web application with a React + TypeScript + Vite frontend and a Node.js/Express backend (see `Gilsanum-server`).

---

## Prerequisites

- Node.js (v18 or later recommended)
- npm (v9 or later recommended)
- [Mapbox](https://account.mapbox.com/) access token (for map features)

---

## Project Structure

- `gilsanum-client/` — Frontend (React, Vite, TypeScript)
- `Gilsanum-server/` — Backend (Node.js, Express)

---

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/md-ashikur/Gilsanum-server.git
cd Gilsanum-server
```

---

### 2. Backend Setup (`Gilsanum-server`)

```
cd Gilsanum-server
npm install

# Create a .env file and set environment variables (see .env.example if available)
# Example:
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000

npm run dev   # or: npm start
```

The backend will start on the port specified in your `.env` (default: 5000).

---

### 3. Frontend Setup (`gilsanum-client`)

```
cd gilsanum-client
npm install

# Create a .env file and set your Mapbox token:
# VITE_MAPBOX_TOKEN=your_mapbox_access_token

npm run dev
```

The frontend will start on [http://localhost:5173](http://localhost:5173) by default.

---

## Environment Variables

### Backend (`Gilsanum-server/.env`)
- `MONGODB_URI` — MongoDB connection string
- `PORT` — Port for backend server

### Frontend (`gilsanum-client/.env`)
- `VITE_MAPBOX_TOKEN` — Mapbox access token

---

## Useful Scripts

### Frontend
- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

### Backend
- `npm run dev` — Start backend in development mode (with nodemon)
- `npm start` — Start backend in production mode

---

## Linting & Formatting

See below for ESLint configuration and recommendations for both frontend and backend.

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
