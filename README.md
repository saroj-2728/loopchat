# The Next Chat App

This is a real-time chat application built using **Next.js**, **Express.js** (for **Socket.io** server) with **Tailwind CSS** for styling and **MongoDB** for data storage. It features user registration, login, and messaging functionality.  

I have deployed this app through vercel. You can have a look at it here https://next-js-chat-app-5lgs.vercel.app/

## Features

- **Real-time messaging**: Chat with other users instantly.
- **User Authentication**: Secure user login and registration.
- **Responsive Design**: Mobile-friendly and responsive UI using Tailwind CSS.
- **Persistent User Sessions**: Session persistence using cookies and localStorage.
- **Database**: MongoDB for user data storage.

## Technologies Used

- **Next.js** (With the App Router)
- **Express.js** (For Socket IO server)
- **Socket.io** (For Real-time messaging)
- **Tailwind CSS** (For responsive and modern design)
- **MongoDB** (Database connection and storage)
- **Mongoose** (ODM for MongoDB)

## Installation

Follow the steps below to get the project running on your local machine:

1. **Clone the repository** :
   ```bash
   git clone https://github.com/saroj-2728/next_js_chat_app.git
   cd next_js_chat_app

2. **Install dependencies on the client and server sides** :  
    Server dependencies
    ```bash
   cd server
   npm install
   ```

   Client dependencies
   ```bash
   cd client
   npm install

3. **Set up environment variables :**  
    Create a .env.local file in the client directory and add the following environment variables:
    ```bash
    cd client
    touch .env.local
    ```  
    And in .env.local, enter your MongoDB environment variable for the database connection  
    MONGODB_URI=your-mongodb-connection-string

4. **Change the server URL :**  
    Change the target server URL to hit requests to the express server on your local machine
    ```bash
    cd client/app/[user]/messages/[slug]/page.js
    ```

    And in socketRef.current = io('https://next-js-chat-app.onrender.com/', { transports: ['websocket'] }); change the URL to http://localhost:3001 (your local express server)

5. **Run the development server :**  
    Since both Next and Express servers are used, both the servers need to run at the same time for the messaging system to work

    Client Server
    ```bash
    cd client
    npm run dev
    ```

    And in another terminal
    ```bash
    cd server
    node server.js
    ```

The application will be available at http://localhost:3000.

