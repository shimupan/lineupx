# LineupX Server

The backend server of LineupX. Expressed is used to communicate with frontend and MongoDB is the database.

# Quick Start

1) First install all required packages: (make sure you have node installed) 

       npm install

2) Make a local `.env` according to `.env.example`

3) Run the following command to start the server on localhost:
       
       npm start

# Using MongoDB locally

1) Make sure MongoDB is installed (recommend to use the gui)

2) Import the database schema

3) Make sure your `.env` is configured with the correct database info

Example:

MONGO_URI=mongodb://127.0.0.1:27017/lineupx
JWT_SECRET=your_jwt_secret
PORT=3000