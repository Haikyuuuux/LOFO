# Lost and Found Platform

## Project Description
A full-stack lost-and-found web application that lets users report lost or found items, browse listings, manage their profile, and upload item photos. The frontend is built with Next.js, and the backend uses Express with RESTful routes for authentication, user management, and item CRUD operations.

## Core Principle
Help people reunite with their lost belongings quickly and safely by providing a clear, trusted flow to report, browse, and claim items—with photos, details, and status updates—backed by secure auth and full CRUD APIs.

## Core Requirements

Your application must include:

1. CRUD Functionalities

Create – Insert data into the database  
Read – Display or retrieve existing data.  
Update – Edit or modify existing data.  
Delete – Remove records from the database

## Features

### Authentication & User Management
- **User Registration** - Create new accounts with username, email, and password
- **User Login** - Secure authentication using JWT tokens
- **User Profile** - View and manage personal information
- **Profile Editing** - Update username, email, contact number, and profile picture
- **Profile Picture Upload** - Upload and manage profile photos
- **Session Management** - Persistent login with token-based authentication

### Item Reporting
- **Report Lost Items** - Create detailed reports for lost belongings
- **Report Found Items** - Report items you've found to help reunite with owners
- **Image Upload** - Upload photos of items for better identification
- **Detailed Descriptions** - Include item name, description, and location
- **Form Validation** - Real-time validation with progress indicators
- **Helpful Tips** - Contextual guidance for reporting lost or found items

### Item Browsing & Management
- **Browse Lost Items** - View all reported lost items in a grid layout
- **Browse Found Items** - View all reported found items in a grid layout
- **Item Details Modal** - Click any item to view full details including images
- **Item Filtering** - Filter items by type (lost/found)
- **Mark as Returned** - Delete items when they've been reunited with owners
- **Ownership Verification** - Only item owners can delete their own listings

### User Interface
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS
- **Image Previews** - Preview images before uploading
- **Loading States** - Visual feedback during data fetching and submissions
- **Error Handling** - User-friendly error messages and validation feedback
- **Navigation Header** - Easy access to all features from any page

### Technical Features
- **RESTful API** - Backend API with Express.js and MySQL
- **File Upload** - Multer middleware for handling image uploads
- **JWT Authentication** - Secure token-based authentication system
- **Database Integration** - MySQL database for persistent data storage
- **CORS Support** - Cross-origin resource sharing enabled
- **Error Handling** - Comprehensive error handling on both frontend and backend

## Getting Started

From the `frontend` directory, start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

From the `backend` directory, start the Express API server:

```bash
npm install
npm start
```
