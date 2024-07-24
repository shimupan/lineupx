### All information about contributing will be avaliable within the docs folder!

### Getting Started

1) Make sure npm is installed

    ```npm install -g npm```
2) Clone or Fork the Repository

3) Make a Free Cloudinary Account and visit your dashboard. You should see 3 keys:
    <img src="./assets/CLOUDINARY.png" />
    You will need these later
4) Also make sure docker is installed and docker desktop is avaliable

### Setting up Frontend
1) Create a new ```.env``` file and copy the contents of ```.env.example```

    On local branch:
    
    ``` VITE_SERVER_URL=http://localhost:1337 ```
    
    Docker exposes port 1337

    ```VITE_CLOUDINARY_CLOUD_NAME=```

    Cloud Name is your Cloudinary Cloud Name

### Setting up Server
1) Create a new ```.env``` file and copy the contents of ```.env.example```

    On local branch:
    
    ```
    ACCESS_TOKEN_SECRET
    REFRESH_TOKEN_SECRET
    EMAIL_USER
    EMAIL_PASSWORD
    EMAIL_DOMAIN
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET
    ``` 
    doesnt matter you can leave them blank

    The following below needs to be setup:
    ```
    MONGO_URI=mongodb://admin:admin@lineupx_db:27017/LineupX
    PORT=1337
    CLOUDINARY_SECRET=[secret key]
    CLOUDINARY_CLOUD_NAME=[cloud name]
    CLOUDINARY_API_KEY=[api key]
    ```

### Running application
1) Make sure you're in the root directory of the project
2) Run the following command:
    ```
    docker compose up
    ```
3) Now the frontend, server, and database should be up and running!

### Happy Developing!

    