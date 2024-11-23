# LoopChat

LoopChat is a dynamic real-time chat application built using Next.js, Express.js, Tailwind CSS, and MongoDB. It supports user registration and authentication powered by Firebase Auth, real-time messaging, profile uploads, profile editing, and more. Designed with a responsive, mobile-friendly interface, LoopChat delivers a seamless user experience across devices.

## Live Demo
Check out the live app: [LoopChat](https://next-js-chat-app-5lgs.vercel.app/)

---

## Features

- **Real-time Messaging**: Instant messaging between users.
- **User Authentication**:
  - Email/Password authentication
  - Google Sign-in integration
  - GitHub Sign-in integration
  - Secure session management
- **Profile Management**:
  - Upload and update profile pictures
  - Edit user details
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS.
- **Persistent User Sessions**: Maintains user sessions with firebase.
- **Database**: MongoDB for storing user data.  
---

## Technologies Used

### Frontend (Next.js Client)

- **Next.js (v14.2)** with App Router
- **Firebase Authentication**:
  - Email/Password authentication
  - Google OAuth provider
  - GitHub OAuth provider
- **Socket.io-client (v4.8.0)** for real-time messaging
- **React Hook Form (v7.53.0)** for form handling and validation
- **React Icons (v5.3.0)** for UI icons
- **js-cookie (v3.0.5)** for cookie management
- **Tailwind CSS (v3.4.1)** for styling
- **Mongoose (v8.6.2)** for database operations

### Backend (Express Server)

- **Express.js (v4.21.0)** for server implementation
- **Socket.io (v4.8.0)** for real-time server events and messaging
- **Cloudinary (v2.5.1)** for file storage and management
- **Firebase Admin (v13.0.0)** for server-side authentication
- **Mongoose (v8.7.2)** for MongoDB operations
- **Multer** for file upload handling

---