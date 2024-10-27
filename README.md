# The Next Chat App

This is a real-time chat application built using **Next.js**, **Express.js**, **Tailwind CSS** for styling, and **MongoDB** for data storage. The app supports user registration, login, and messaging functionality with a responsive design.

Check out the live app: [The Next Chat App](https://next-js-chat-app-5lgs.vercel.app/)

## About This Repository

This repository contains two branches with slightly different implementations of backend connectivity:

- **Main branch**: Uses **Next.js** for the frontend, with **Express.js** managing the backend database connections and socket events.
- **next-with-server-actions branch**: Implements **Next.js Server Actions** for database connectivity, utilizing **Express.js** only for managing the socket server.

## Features

- **Real-time messaging**: Instant messaging between users.
- **User Authentication**: Secure login and registration.
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS.
- **Persistent User Sessions**: Maintains user sessions with cookies and localStorage.
- **Database**: MongoDB for storing user data.

## Technologies Used

- **Next.js** (with App Router)
- **Express.js** (For Socket.io server and backend services)
- **Socket.io** (For real-time client-server messaging)
- **Tailwind CSS** (For modern, responsive UI design)
- **MongoDB** (For database storage)
- **Mongoose** (ODM for MongoDB)
- **React Hook Form** (For form validation)
