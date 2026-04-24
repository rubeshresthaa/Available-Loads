# Cargo Load Management System

A full-stack application for managing cargo loads, featuring an Express/Node.js backend and an Expo/React Native mobile frontend.

## 🚀 Getting Started

Follow these instructions to get both the backend and frontend running on your local machine.

---

### 1. Backend Setup (Express & MongoDB)

The backend handles data storage, API routes, and Swagger documentation.

**Location:** `./backend`

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Run the Server:**
   - Development (with hot reload): `npm run dev`
   - Production: `npm run start`

4. **API Documentation:**
   Once the server is running, visit: `http://localhost:3001/api-docs` or you can use `https://express-backend-peach.vercel.app/api-docs` as it the deployed URL

---

### 2. Frontend Setup (Expo & React Native)

The mobile app allows drivers to view available loads and accept them.

**Location:** `./frontend`

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the `frontend` folder:
   ```env
   EXPO_PUBLIC_API_URL=http://your-local-ip:3001/api or https://express-backend-peach.vercel.app/api as it the deployed URL
   ```
   *Note: Use your machine's local IP address (e.g., `192.168.1.XX`) so your physical device or emulator can connect to the backend.*

3. **Run the App:**
   ```bash
   npx expo start -c
   ```
   - Press `a` for Android
   - Press `i` for iOS
   - Scan the QR code with the Expo Go app on your phone.

---

### 📂 Project Structure

- **`backend/src`**: Contains controllers, models, routes, and database configuration.
- **`frontend/src`**: 
  - `app/`: Expo Router file-based navigation.
  - `components/`: Reusable UI components (e.g., `LoadCard`).
  - `screens/`: Main screen logic (e.g., `LoadBoardScreen`).
  - `store/`: Redux Toolkit (RTK Query) for state management and API calls.
  - `types/`: Shared TypeScript definitions.

---

### 🛠️ Key Features
- **Atomic Load Acceptance**: Prevents multiple drivers from accepting the same load.
- **Real-time UI Updates**: RTK Query cache invalidation ensures the list updates immediately after acceptance.
- **Senior Architecture**: Clean folder structure with path aliases (`@/` for code, `@assets/` for root assets).
- **Fully Optimized**: Memoized components and high-performance FlatList configuration.
