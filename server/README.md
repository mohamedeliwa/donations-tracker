# API made for donations tracker app

Simple api for donations tracker app.  
Built using 
- Nodejs and Express as Back-end server  

This App is simple and consists of:

- GET end-point to get the current donations values
- POST end-point to update the donations values
- POST end-point for logining in and sending a JWT
- POST end-point for validating JWT

*.env variables* needed by This App to run:

- USERNAME => hard-coded username for the only user allowed to interact with the authenticated routes
- PASSWORD => hard-coded password for the only user allowed to interact with the authenticated routes
- USER_ID => hard-coded ID for the only user allowed to interact with the authenticated routes, used to generate the JWT
- JWT_SECRET
