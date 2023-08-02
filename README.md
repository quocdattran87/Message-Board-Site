## Third Year University Assignment

A website with user creation and login, profile updates, messaging with two layer replies. Messages require the ability to send images. All data is stored in tables built by Sequelize ORM. GET/PUT/POST/DELETE are done using custom queries.

- 'React' directory contains frontend code.
- 'Express' directory contains middle/back end code. Requires a MySQL database to be spun up with correct end point, username, db, and password configured.
- 'GraphQL' directory is an entire project on it's own testing out the GraphQL framework to set up API calls and a pub/sub event system.

### Run the Node Express project
- From inside the 'express' directory, run 'node server.js'. Requires a MySQL db to be running with correct credentials put into 'express/src/database/config.js'
- From inside the 'react' directory, run 'npm start'. Go to 'http://localhost:3000/' (or whatever port number is assigned) in your browser. The frontend requires the backend to be running so it can make API calls to send and retrieve data for the site to operate correctly.

### Run the GraphQL project
- From inside the 'graphQL/express' directory, run 'node server.js'.
- From inside the 'graphQL/frontend' directory, run 'npm start'.

### Dependencies
Inside any react/frontend folder:
- npm install speakeasy qrcode
- npm install --save-dev react-app-rewired   
- npm install --save-dev crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
- npm install react-router-dom@6 axios react-quill --save 

Inside any express folder:
- npm install express sequelize mysql2 cors argon2 --save 
