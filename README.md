# Appointment Manager Application

Welcome to the **Appointment Manager**, a comprehensive full-stack web application designed to streamline the process of scheduling, managing, and tracking appointments. This application provides a seamless experience for both customers looking to book time slots and administrators managing their availability and bookings.

Built with a modern technology stack, this project leverages the power of **React** for a dynamic frontend, **Express.js** for a robust backend API, and **MongoDB** for flexible data storage. It features secure authentication, real-time booking updates, email notifications, and a responsive design.

---

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Key Features](#key-features)
    *   [Customer Features](#customer-features)
    *   [Admin Features](#admin-features)
3.  [Technology Stack](#technology-stack)
    *   [Frontend](#frontend)
    *   [Backend](#backend)
    *   [Database & Tools](#database--tools)
4.  [Prerequisites](#prerequisites)
5.  [Installation & Setup](#installation--setup)
6.  [Configuration](#configuration)
7.  [Project Structure](#project-structure)
    *   [Directory Breakdown](#directory-breakdown)
    *   [Key Files Description](#key-files-description)
8.  [Architecture](#architecture)
    *   [Frontend Architecture](#frontend-architecture)
    *   [Backend Architecture](#backend-architecture)
    *   [Authentication Flow](#authentication-flow)
9.  [Database Schema](#database-schema)
    *   [User Model](#user-model)
    *   [TimeSlot Model](#timeslot-model)
    *   [Booking Model](#booking-model)
    *   [OTP Model](#otp-model)
    *   [BlockedDate Model](#blockeddate-model)
10. [API Documentation](#api-documentation)
    *   [Authentication Endpoints](#authentication-endpoints)
    *   [User Endpoints](#user-endpoints)
    *   [Booking Endpoints](#booking-endpoints)
    *   [Slot Management Endpoints](#slot-management-endpoints)
    *   [Utility Endpoints](#utility-endpoints)
11. [Detailed API Examples](#detailed-api-examples)
12. [Component Documentation](#component-documentation)
13. [Security Implementation](#security-implementation)
14. [Performance & Best Practices](#performance--best-practices)
15. [Repository File Map](#repository-file-map)
16. [Development Scripts](#development-scripts)
17. [Troubleshooting](#troubleshooting)
18. [Contributing](#contributing)
19. [License](#license)

---

## Project Overview

The **Appointment Manager** addresses the need for a simple yet powerful booking system. Traditional booking methods can be cumbersome and prone to errors. This application digitizes the process, allowing for:

*   **Efficiency**: Automates slot management and booking confirmations.
*   **Accessibility**: Users can book slots 24/7 from any device.
*   **Control**: Admins have full control over their schedule, capable of blocking dates or deleting slots.
*   **Trust**: Automated email confirmations and Google Calendar-like interactions build user trust.
*   **Scalability**: Built on Node.js and MongoDB, the system can handle thousands of concurrent users and bookings.
*   **Security**: Integrated with secure OTP-based email verification and session-based authentication using industry standards.

The application is designed to be easily deployable on platforms like Vercel, with a clear separation between client and server responsibilities while maintaining a monorepo-like structure for ease of development.

---

## Key Features

The application serves two distinct user roles: **Customer** and **Administrator**. Each role has a tailored dashboard and set of features.

### Customer Features

*   **Secure Registration & Login**: 
    *   Sign up using email, username, and password.
    *   **Email Verification**: Integrated OTP (One-Time Password) system sent via email to verify identity during registration.
    *   Session persistency for seamless usage.
*   **Dashboard**:
    *   View upcoming appointments.
    *   Access quick actions like booking a new slot.
*   **Book Appointments**:
    *   Interactive calendar view to see available dates.
    *   View available time slots for a selected date.
    *   Real-time capacity checking (slots show remaining seats).
*   **My Bookings**:
    *   List of all past and future bookings.
    *   Status tracking (Pending, Confirmed, Cancelled).
    *   Ability to cancel pending appointments.
*   **Profile Management**:
    *   Update personal details (Name, Phone).
    *   Upload profile avatar.
    *   Change password securely.
    *   Update email address (with uniqueness checks).

### Admin Features

*   **Usage Statistics**:
    *   Dashboard overview of total bookings, confirmed bookings, and pending requests.
*   **Slot Management**:
    *   **Create Slots**: Define date, start time, end time, and capacity for new slots.
    *   **Delete Slots**: Remove unused slots (protected against deleting slots with active bookings).
    *   **Block Dates**: Mark specific dates as unavailable to prevent slot creation or bookings.
*   **Booking Management**:
    *   View all bookings from all users.
    *   Filter bookings by status or date.
    *   **Confirm Bookings**: Approve pending booking requests.
    *   **Cancel Bookings**: reject or cancel existing bookings with automated email notifications to the customer.
*   **Notifications**:
    *   Receive system alerts for new bookings.

---

## Technology Stack

This project is built using the **PERN** (PostgreSQL-equivalent with Mongo) stack, although strictly it is **MERN** (MongoDB, Express, React, Node).

### Frontend

The client-side is a Single Page Application (SPA) built with:

*   **React (v18)**: The core library for building the user interface.
*   **Vite**: A next-generation frontend tool for fast builds and hot module replacement (HMR).
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Radix UI**: A set of headless UI components for accessible, unstyled widgets (Dialogs, Dropdowns, Toast, etc.).
*   **TanStack Query (React Query)**: For powerful asynchronous state management and data fetching.
*   **Wouter**: A minimalist routing library for React, serving as a lighter alternative to React Router.
*   **Framer Motion**: For smooth animations and transitions.
*   **Lucide React**: A beautiful and consistent icon set.
*   **Hook Form (React Hook Form)**: For flexible and performant form validation.
*   **Zod**: TypeScript-first schema declaration and validation.

### Backend

The server-side is a RESTful API powered by:

*   **Node.js**: The runtime environment.
*   **Express.js**: The web framework for handling routes and middleware.
*   **Passport.js**: Authentication middleware for Node.js.
    *   `passport-local`: Username and password authentication strategy.
*   **Express Session**: Simple session middleware for storing user sessions.
*   **Multer**: Node.js middleware for handling `multipart/form-data`, primarily for file uploads.
*   **Nodemailer**: For sending transactional emails (OTPs, confirmations).

### Database & Tools

*   **MongoDB**: NoSQL database for storing users, bookings, and slots.
*   **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **Connect Mongo**: MongoDB session store for Express.
*   **TypeScript (Partial)**: Used for type checking and schema definition via Zod.
*   **PostCSS / Autoprefixer**: CSS processing tools.

---

## Prerequisites

Before running this project locally, ensure you have the following installed on your machine:

1.  **Node.js**: Version 18.x or higher is recommended.
    *   Verify with: `node -v`
2.  **npm** (Node Package Manager): Usually comes with Node.js.
    *   Verify with: `npm -v`
3.  **MongoDB**: You need a running instance of MongoDB. This can be a local installation or a cloud instance (e.g., MongoDB Atlas).

---

## Installation & Setup

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/appointment-manager.git
cd appointment-manager
```

### 2. Install Dependencies

Install the dependencies for both the root, client, and server. Since this project uses a unified `package.json` for managing dependencies across the stack:

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory. You can duplicate the `.env.example` if it exists, or create a new one with the following keys:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/appointment_manager

# Authentication
SESSION_SECRET=your_super_secret_session_key

# Email Service (For OTPs and Notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

> **Note**: For Gmail, you will need to generate an "App Password" if you have 2-Factor Authentication enabled.

### 4. Database Seeding (Optional)

The server includes a seeding script (`server/routes.js` -> `seedDatabase`) that runs on startup if the database is empty. It creates:
*   **Admin User**: `admin` / `admin123`
*   **Customer User**: `customer` / `customer123`
*   **Sample Slots**: For the next 5 days.

### 5. Running the Application

To start the development server (which runs both the frontend and backend concurrently):

```bash
npm run dev
```

*   The backend will start on port `5000` (or your configured port).
*   The frontend will be served by Vite, typically on port `5173` (proxied to backend).

Visit `http://localhost:5000` to see the application.

---

## Configuration

Detailed explanation of the configuration files in the root directory.

### `package.json`

This is the manifest file for the project. It defines:
*   **Scripts**:
    *   `dev`: Starts the Node server (`node server/index.js`). Since we have Vite integration in development mode within the server, this serves both.
    *   `build`: Builds the client for production (`node script/build.js`).
    *   `start`: Runs the production server (`NODE_ENV=production node dist/index.cjs`).
*   **Dependencies**: Lists all libraries including `express`, `react`, `mongoose`, etc.

### `vite.config.js`

Configuration for the Vite build tool.
*   **Plugins**: Uses `@vitejs/plugin-react` for React support.
*   **Build**: Configured to output to `dist/public` so the Express server can serve static files easily in production.
*   **Resolve**: Sets up path aliases (e.g., `@` pointing to `client/src`).

### `tailwind.config.js`

Configuration for Tailwind CSS.
*   **Content**: Specifies paths (`./client/src/**/*.{js,jsx,ts,tsx}`) where Tailwind should look for classes to generate.
*   **Theme**: Extends the default theme with custom colors (like `primary`, `secondary`, `destructive`), border radius, and animations keyframes.
*   **Plugins**: Includes `tailwindcss-animate` for easy animation utilities.

### `tsconfig.json`

TypeScript configuration file. Even though the project is largely JS/JSX, this helps with:
*   IntelliSense in VS Code.
*   Parsing paths (`@/*` alias setup).
*   Defining compiler options for React and DOM interaction.

---

## Project Structure

The project follows a focused monorepo-style structure.

```text
c:\MyStuff\Appointment-Manager
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── client/                 # Frontend source code
│   ├── index.html          # Entry HTML file
│   └── src/
│       ├── main.jsx        # React entry point
│       ├── App.jsx         # Main App component & Routing
│       ├── index.css       # Global styles & Tailwind directives
│       ├── components/     # Reusable UI components
│       │   ├── ui/         # Radix/Shadcn-like primitive components (Button, Input, etc.)
│       │   ├── Navigation.jsx      # Top navigation bar
│       │   ├── ProtectedRoute.jsx  # HOC for route protection
│       │   └── SlotCard.jsx        # Component to display time slots
│       ├── pages/          # Page components (Views)
│       │   ├── AuthPage.jsx        # Login/Register page
│       │   ├── CustomerDashboard.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── ManageSlots.jsx
│       │   ├── MyBookings.jsx
│       │   ├── ProfilePage.jsx
│       │   └── not-found.jsx
│       ├── hooks/          # Custom React hooks
│       │   ├── use-auth.js         # Authentication hook (User context)
│       │   └── use-toast.js        # Toast notification hook
│       └── lib/            # Utilities and helpers
│           ├── queryClient.js      # React Query client instance
│           └── utils.js            # Class name merger (cn), etc.
├── server/                 # Backend source code
│   ├── index.js            # Server entry point (Express setup)
│   ├── routes.js           # API route definitions
│   ├── auth.js             # Passport authentication logic
│   ├── db.js               # Database connection logic
│   ├── models.js           # Mongoose schemas/models
│   ├── storage.js          # DAL (Data Access Layer) abstraction
│   ├── email.js            # OTP email sending logic
│   ├── mailer.js           # Booking notification emails
│   └── vite.js             # Vite middleware integration for dev
├── shared/                 # Shared code between client and server
│   ├── schema.js           # Zod validation schemas
│   └── routes.js           # Shared route constants
└── uploads/                # Directory for uploaded files
```

### Key Files Description

#### `client/src/App.jsx`
The heart of the frontend application. It sets up the `QueryClientProvider` for data fetching, the `Toaster` for notifications, and most importantly, the **Router**. It uses `wouter` to define routes like `/login`, `/dashboard`, and `/admin`. It also includes a `RootRedirect` component that intelligently redirects users based on their login status and role.

#### `server/storage.js`
This file acts as an abstraction layer over the database. Instead of calling Mongoose models directly in the routes, the application uses `storage` methods (e.g., `storage.getUser`, `storage.createSlot`). This pattern (Repository Pattern) creates a clean separation of concerns and makes the code more testable and maintainable.

#### `server/auth.js`
Contains all the security logic. It configures `passport-local` to verify credentials against the database using `scrypt` hashing. It also sets up the session serialization/deserialization logic, allowing the server to remember logged-in users via cookies.

#### `shared/schema.js`
This file is crucial for data integrity. It exports `zod` schemas that define the shape of valid data (e.g., `insertUserSchema`, `insertSlotSchema`). These schemas are likely used on the backend to validate incoming API requests and could be used on the frontend for form validation.

---

## Architecture

### Frontend Architecture

The frontend is built on a component-based architecture.

1.  **Component Library**: The `components/ui` folder serves as a design system foundation. These components (Button, Card, Input) are styled with Tailwind and behave consistently across the app.
2.  **Page Layouts**: Each "Page" component corresponds to a specific route. Pages are composed of smaller organisms (e.g., `AdminDashboard` uses cards to show stats and lists).
3.  **State Management**: 
    *   **Local State**: `useState` is used for form inputs and UI toggles.
    *   **Server State**: `TanStack Query` is used to cache and synchronize data from the API (e.g., fetching lists of slots or bookings). This handles loading states and error states automatically.
    *   **Auth State**: A custom `AuthProvider` (via `useUser` hook) maintains the current user's session information globally.

### Backend Architecture

The backend follows a standard MVC (Model-View-Controller) pattern, though simplified for an API-focused app.

1.  **Entry Point (`index.js`)**: Initializes the Express app, attaches middleware (JSON parsing, Sessions), and enables Vite middleware for development (Hot Module Replacement on the backend!).
2.  **Routing (`routes.js`)**: Defines the HTTP endpoints. Routes are grouped by resource (Auth, Slots, Bookings).
3.  **Controllers (Inline)**: Currently, the logic for handling requests is written directly inside the route definitions. For larger apps, these would be extracted to separate controller files.
4.  **Services/Storage**: The `storage.js` file handles the business logic involving database operations.
5.  **Utils**: Specialized files for specific tasks (Emailing, Hashing).

### Authentication Flow

1.  **Registration**:
    *   User submits Email.
    *   Server generates OTP -> Saves to DB -> Sends Email.
    *   User submits OTP + Details.
    *   Server verifies OTP -> Creates User -> Establishes Session.
2.  **Login**:
    *   User submits Username/Password.
    *   Pascal strategy authenticates -> specific session cookie is set.
3.  **Protection**:
    *   Middleware checks `req.isAuthenticated()` before allowing access to sensitive routes.
    *   Frontend `ProtectedRoute` component checks `user` object before rendering page content.

---

## Database Schema

The database is structured using Mongoose schemas.

### User Model
Stores user identity and role.
```javascript
{
  username: { type: String, unique: true },
  password: { type: String }, // Hashed
  role: { type: String, enum: ["admin", "customer"] },
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date }
}
```

### TimeSlot Model
Represents an available window for booking.
```javascript
{
  date: { type: String }, // Format: YYYY-MM-DD
  startTime: { type: String }, // Format: HH:mm
  endTime: { type: String }, // Format: HH:mm
  capacity: { type: Number },
  bookedCount: { type: Number }
}
```

### Booking Model
Links a User to a TimeSlot.
```javascript
{
  userId: { type: ObjectId, ref: "User" },
  slotId: { type: ObjectId, ref: "TimeSlot" },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
  createdAt: { type: Date }
}
```

### OTP Model
Temporary storage for validation codes.
```javascript
{
  email: { type: String },
  otp: { type: String },
  createdAt: { type: Date, expires: 900 } // TTL index (auto-delete after 15 mins)
}
```

### BlockedDate Model
Stores dates that the admin has explicitly closed.
```javascript
{
  date: { type: String, unique: true },
  reason: { type: String }
}
```

---

## API Documentation

The API is mounted at `/api`. All responses are in JSON format.

### Authentication Endpoints

#### `POST /api/register`
Register a new user using verified email.
*   **Body**: `{ email, otp, username, password, name, phone }`
*   **Response**: `201 Created` - User object.
*   **Errors**: `400` (Invalid OTP, Username taken).

#### `POST /api/login`
*   **Body**: `{ username, password }`
*   **Response**: `200 OK` - User object.

#### `POST /api/logout`
Destroys the session.
*   **Response**: `200 OK`.

#### `POST /api/send-otp`
Triggers an OTP email.
*   **Body**: `{ email }`
*   **Response**: `200 OK` - Message indicating success.

#### `GET /api/user`
Get current logged-in user details.
*   **Response**: `200 OK` - User object or `401 Unauthorized`.

### Slot Management Endpoints

#### `GET /api/slots`
Get list of available slots.
*   **Query Params**: `?date=YYYY-MM-DD` (Optional)
*   **Response**: Array of `TimeSlot` objects.

#### `POST /api/slots` (Admin Only)
Create a new time slot.
*   **Body**: `{ date, startTime, endTime, capacity }`
*   **Response**: `201 Created` - Created slot.

#### `DELETE /api/slots/:id` (Admin Only)
Delete a slot.
*   **Response**: `204 No Content`.
*   **Error**: `400` if slot has active bookings.

### Booking Endpoints

#### `GET /api/bookings`
Get bookings. Customers see only their own; Admins see all.
*   **Response**: Array of `Booking` objects populated with `userId` and `slotId` details.

#### `POST /api/bookings`
Request a booking.
*   **Body**: `{ slotId }`
*   **Response**: `201 Created`.

#### `PATCH /api/bookings/:id/cancel`
Cancel a booking.
*   **Response**: `200 OK` - Updated booking object.
*   **Note**: Customers can only cancel their own.

#### `PATCH /api/bookings/:id/confirm` (Admin Only)
Confirm a pending booking.
*   **Response**: `200 OK` - Updated booking object.

### Utility Endpoints

#### `POST /api/upload`
Upload a file (e.g., avatar).
*   **Body**: `multipart/form-data` with field `file`.
*   **Response**: `{ url: "data:image/..." }` (Returns Base64 Data URI).

---

## Detailed API Examples

Here are `curl` examples to help you interact with the API directly.

### 1. Register a User
First, send an OTP:
```bash
curl -X POST http://localhost:5000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com"}'
```

Then, register with the code received:
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "otp": "123456",
    "username": "jane_doe",
    "password": "secretPassword",
    "name": "Jane Doe",
    "phone": "555-0199"
  }'
```

### 2. Login
This will return a `connect.sid` cookie in the headers which must be used for subsequent requests.
```bash
curl -c cookies.txt -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "jane_doe", "password": "secretPassword"}'
```

### 3. Create a Slot (Admin)
(Assuming you are logged in as admin using the cookie jar)
```bash
curl -b cookies.txt -X POST http://localhost:5000/api/slots \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-25",
    "startTime": "10:00",
    "endTime": "11:00",
    "capacity": 5
  }'
```

### 4. Book a Slot
```bash
curl -b cookies.txt -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"slotId": "65e0da..."}'
```

---

## Component Documentation

A deeper look into the core frontend components.

### `ProtectedRoute.jsx`
*   **Path**: `client/src/components/ProtectedRoute.jsx`
*   **Purpose**: A Higher-Order Component (HOC) that wraps pages requiring authentication.
*   **Props**:
    *   `path` (string): The route path.
    *   `component` (Component): The React component to render.
    *   `roles` (string[]): Optional. Array of allowed roles (e.g., `['admin']`).
*   **Logic**:
    *   Checks loading state of `useUser()`.
    *   If no user -> Redirects to `/AuthPage`.
    *   If user but wrong role -> Redirects to `/` (RootRedirect logic takes over).
    *   Else -> Renders the component.

### `SlotCard.jsx`
*   **Path**: `client/src/components/SlotCard.jsx`
*   **Purpose**: Displays a single time slot with booking controls.
*   **Props**:
    *   `slot` (Object): The TimeSlot object.
    *   `onBook` (Function): Callback when "Book" button is clicked.
    *   `userRole` (string): "admin" or "customer".
*   **Features**:
    *   Shows Start and End time.
    *   Displays "Full" badge if `bookedCount >= capacity`.
    *   Disables button if full or already booked (logic handled by parent).

### `Navigation.jsx`
*   **Path**: `client/src/components/Navigation.jsx`
*   **Purpose**: Responsive top navigation bar.
*   **Features**:
    *   Displays Logo/Title.
    *   Shows User Avatar and Dropdown.
    *   **Dropdown Actions**: Profile, My Bookings (Customer), Logout.
    *   Adapts links based on `user.role` (e.g., "Manage Slots" for Admin).

### `ui/toaster.tsx` & `ui/use-toast.js`
*   **Purpose**: Provides a global notification system.
*   **Usage**: `const { toast } = useToast(); toast({ title: "Success", description: "Booking confirmed" })`.
*   **Implementation**: Uses Reducer pattern to manage a queue of toasts.

---

## Security Implementation

Security is a primary concern in this application.

### 1. Password Security
We do **not** store plain-text passwords.
*   **Algorithm**: `scrypt` (via Node's native `crypto` module).
*   **Salt**: A random 16-byte hex salt is generated for every user.
*   **Storage**: `hash.salt` string is stored in MongoDB.
*   **Verification**: `timingSafeEqual` is used to prevent timing attacks during password comparison.

### 2. Session Management
*   **Secure Cookies**: Cookies are set with `httpOnly` (preventing XSS access) and `secure` (in production) flags.
*   **Store**: `connect-mongo` stores session data in MongoDB, ensuring sessions persist across server restarts (unlike memory store).

### 3. API Security
*   **Input Validation**: `Zod` schemas validate every single request body on the server. Invalid data is rejected immediately with `400 Bad Request`.
*   **Authorization**: Middleware ensures users can only access their own data. For example, `PATCH /bookings/:id/cancel` checks if `booking.userId === req.user.id`.

### 4. Environmental Security
*   Secrets (DB URI, Session Key, Email Credentials) are loaded via `dotenv` and are never committed to the codebase (enforced by `.gitignore`).

---

## Performance & Best Practices

1.  **React Query (TanStack Query)**:
    *   **Caching**: API responses are cached. If you navigate away and back, data is shown instantly from cache while a background refetch ensures freshness (`stale-while-revalidate`).
    *   **Optimistic Updates**: (Can be implemented) to show UI changes immediately before server confirms.
    *   **Invalidation**: When a Booking is made, the `['slots']` query is invalidated to immediately reflect updated capacity.

2.  **Code Splitting**:
    *   Vite automatically splits chunks.
    *   Lazy loading can be added for heavyweight routes if the app grows.

3.  **Database Indexing**:
    *   `username` and `email` are indexed (`unique: true`) for fast lookups.
    *   `OTP` has a TTL index for automatic expiration.

---

## Repository File Map

A comprehensive list of all files in the repository and their purpose.

### Client Source (`client/src`)

#### Components (`client/src/components`)
*   `Navigation.jsx`: Global top navigation bar with user dropdown.
*   `ProtectedRoute.jsx`: Authentication guard wrapper for private routes.
*   `SlotCard.jsx`: Interactive card for displaying and booking time slots.

#### UI Primitives (`client/src/components/ui`)
*   `alert-dialog.jsx`: Modal dialogs for interruptions (e.g., confirmations).
*   `avatar.jsx`: User profile image with fallback.
*   `badge.jsx`: Status indicators (e.g., "Confirmed", "Pending").
*   `button.jsx`: Standard button component with variants.
*   `calendar.jsx`: Date picker component.
*   `card.jsx`: Container for grouped content.
*   `carousel.jsx`: Slideshow component (likely for prospective features).
*   `dialog.jsx`: Overlay modal.
*   `dropdown-menu.jsx`: Menus triggered by buttons (User actions).
*   `form.jsx`: Wrappers for React Hook Form integration.
*   `input.jsx`: Text input fields.
*   `label.jsx`: Text labels for inputs.
*   `separator.jsx`: Visual divider.
*   `sheet.jsx`: Slide-out side panel (used for mobile menu).
*   `sidebar.jsx`: Sidebar navigation component.
*   `skeleton.jsx`: Loading placeholder states.
*   `table.jsx`: Data grid for Admin dashboards.
*   `tabs.jsx`: Tabbed interface.
*   `toast.jsx`: Notification message unit.
*   `toaster.jsx`: Notification provider/container.
*   `tooltip.jsx`: Hover information tags.

#### Pages (`client/src/pages`)
*   `App.jsx`: Main routing logic.
*   `AdminDashboard.jsx`: Admin view for stats and bookings.
*   `AuthPage.jsx`: Login and Registration forms.
*   `CustomerDashboard.jsx`: Customer's main landing page.
*   `ManageSlots.jsx`: Admin interface for creating/deleting slots.
*   `MyBookings.jsx`: List of user's personal bookings.
*   `ProfilePage.jsx`: User settings and profile editing.
*   `not-found.jsx`: 404 Error page.

### Server Source (`server`)
*   `auth.js`: Passport configuration, strategies, and login routes.
*   `db.js`: MongoDB connection helper.
*   `email.js`: Logic for sending OTP emails via Nodemailer.
*   `index.js`: Application entry point, server setup.
*   `mailer.js`: Logic for sending transactional booking emails.
*   `models.js`: Mongoose data models (User, Booking, Slot).
*   `routes.js`: Main API route definitions.
*   `static.js`: Helper for serving static assets in production.
*   `storage.js`: Database repository layer.
*   `vite.js`: Development middleware for Vite integration.

### Shared (`shared`)
*   `routes.js`: Shared route path constants.
*   `schema.js`: Shared Zod validation schemas.

---

## Development Scripts

The `package.json` includes several scripts to assist with development and deployment.

### `npm run dev`
This is the primary command for local development. It runs `node server/index.js`.
*   In development mode, the server initializes a Vite server via middleware (`server/vite.js`).
*   Requests to `/` and other frontend routes are handled by Vite's HTML transformation.
*   Requests to `/api` are handled by Express directly.

### `npm run build`
Runs `node script/build.js`.
*   This script invokes the Vite build process.
*   It compiles the React application into static files (HTML, CSS, JS bundles).
*   The output is placed in `dist/public`.

### `npm start`
Runs the production server.
*   Sets `NODE_ENV=production`.
*   Executes `node dist/index.cjs` (or similar entry point if configured).
*   The server detects production mode and serves the static files from `dist/public` instead of using Vite middleware.

---

## Troubleshooting

### Common Issues

1.  **"Email Service Error"**:
    *   Ensure your `.env` file has correct `EMAIL_USER` and `EMAIL_PASS`.
    *   If using Gmail, ensure "Less secure app access" is enabled or (better) use an App Password.

2.  **"Connection Refused" (MongoDB)**:
    *   Ensure your MongoDB service is running (`mongod`).
    *   Check `MONGODB_URI` in `.env`.

3.  **"Slot Booking Failed"**:
    *   If you cannot book a slot, check if it is already full (Capacity reached).
    *   Ensure you are logged in as a "customer", not "admin" (if restrictions apply).

4.  **Styles not loading**:
    *   Ensure `npm install` was run to fetch Tailwind dependencies.
    *   Check `postcss.config.js` and `tailwind.config.js` presence.

5.  **"Vite manifest not found"**:
    *   This happens if you run `npm start` without running `npm run build` first. The production server needs the built assets.

### Debugging

*   **Server Logs**: The application uses a custom logging function (`server/index.js`) that outputs request method, path, status, and duration. Check console output for API errors.
*   **Browser Console**: React Query errors and frontend validation issues will appear in the browser's DevTools console.

---

## Contributing

Contributions are welcome! If you'd like to improve the Appointment Manager, please follow these steps:

1.  Fork backend repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code follows the existing style ensuring consistent formatting.

---

## License

This project is licensed under the **MIT License**.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

*Generated by Antigravity AI*
