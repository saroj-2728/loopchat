# LoopChat

LoopChat is a feature-rich, real-time chat application built using Next.js, Express.js, Tailwind CSS, and MongoDB. It supports user registration and authentication powered by Firebase Auth, real-time messaging, profile management, friend requests, notifications, and more. Designed with a responsive, mobile-friendly interface, LoopChat delivers a seamless user experience across devices.

## Live Demo
Check out the live app: [LoopChat](https://loopchat0.vercel.app/)

---

## Features

### **Chat Features**
- **Real-time Messaging**: Instant messaging between users with socket.io.
- **Notifications**: Get notified of friend requests, and other updates in real time.

### **User Authentication**
- Email/Password authentication
- Google Sign-in integration
- GitHub Sign-in integration
- Secure session management with Firebase Authentication

### **Social Features**
- **Friend Requests**: Send and manage friend requests seamlessly.
- **Add Friends**: Accept or reject friend requests and maintain a list of friends.
- **Friends List**: View and interact with your friends within the app.

### **Profile Management**
- Upload and update profile pictures with Cloudinary integration.
- Edit user details, including name, bio, and more.

### **Other Features**
- **Responsive Design**: Mobile-friendly interface built using Tailwind CSS.
- **Persistent User Sessions**: Maintains user sessions securely.
- **Database-Driven Features**: Uses MongoDB to store users, messages, and friend-related data.

---

## Technologies Used

### Frontend (Next.js Client)
- **Next.js (v15.0.3)** with App Router.
- **Firebase Authentication**:
  - Email/Password authentication
  - Google OAuth provider
  - GitHub OAuth provider
- **Socket.io-client (v4.8.0)** for real-time messaging.
- **React Hook Form (v7.53.0)** for form handling and validation.
- **React Icons (v5.3.0)** for UI icons.
- **js-cookie (v3.0.5)** for cookie management.
- **Tailwind CSS (v3.4.1)** for modern and responsive styling.

### Backend (Express Server)
- **Express.js (v4.21.0)** for server implementation.
- **Socket.io (v4.8.0)** for real-time server-side messaging and events management.
- **Cloudinary (v2.5.1)** for file storage and profile image management.
- **Firebase Admin (v13.0.0)** for server-side authentication and session management.
- **Mongoose (v8.7.2)** for MongoDB database operations.
- **Multer** for file upload handling.

---

Feel free to contribute and make LoopChat even better!
