# LineupX Server

The backend server of LineupX. Expressed is used to communicate with frontend and MongoDB is the database.

# Quick Start

1.  First install all required packages: (make sure you have node installed)

        npm install

2.  Make a local `.env` according to `.env.example`

3.  Run the following command to start the server on localhost:
    npm start

# Using MongoDB locally

1. Make sure MongoDB is installed (recommend to use the gui)

2. Import the database schema

3. Make sure your `.env` is configured with the correct database info

4. Go to mailer.js and create add your email and password with your preferred EMAIL service.

5. https://www.mongodb.com/docs/manual/tutorial/create-users/#configure-users-for-self-hosted-deployments

6. Connection String: mongodb://"user":"password"@"ip":27017/LineupX?directConnection=true&appName=mongosh+2.1.0
