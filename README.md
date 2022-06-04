## Stackoverflow clone with Node.js

### 1. stacks:
    + Back end: Node.js, Express.js
    + Database: MongoDB

### 2. dependencies:
    + bcryptjs: password encryption operations
    + dotenv: configuration of environment variables
    + express: development back end rest api
    + express-async-handler: error handling in async-await codes
    + jsonwebtoken: creating token
    + mongoose: database operations with mongodb
    + multer: uploading profile photo
    + nodemailer: sending mail
    + slugify: creating slug

### 3. file structure:
    + `server.js`: main file
    + `routes`: a folder that uses the express router feature and keeps the route information in it.
    + `controllers`: a folder that contains controller functions for routes.
    + `models`: a folder that contains user-question-answer models.
    + `middlewares`: a folder that contains middlewares that performs some checks for routes
    + `helpers`: a folder that contains helpers functions like database connection
    + `env`: environment variables
    + `public`: for static files
    + `package.json`: package.json
    + `package-lock.json`: package-lock.json

### 4. database models:

    + `user`: A user model exists in the database. User can sign up with own email and password. User has the "user" role by default. User can optionally add "title, about, place, website" fields. User can view their own profile and upload profile photo. If user forgot his password, he can reset his password. User can create and answer questions.

    + `question`: A question model exists in the database. User can create questions with the question model. User can edit the questions. User can delete questions. User can add answers to questions.

    + `answer`: A answer model exists in the database.

### 5. authentication - authorization

This project uses JSON Web Token for authentication and authorization. You will receive a token when you log in. When you want to reach certain routes, middleware decodes this token and if the token is valid, it allows you to switch to the route. If you want to test this project in an API Testing tool, you should send token information in headers in route requests. Like that:

`Bearer: {{access_token}}`

### 6. routes

    + `/api/auth/register`: register
    + `/api/auth/login: login
    + `api/auth/:user_id`: fetch profile information
    + `api/auth/logout`: log out
    + `api/auth/forgotpassword`: reset your password
    + `api/auth/resetpassword`: reset your password
    + `api/auth/upload`: upload a profile image
    + `api/auth/userEdit`: edit own informations

    + `api/users/`: get all users
    + `api/users/:id`: get single user with parameter
  
    + `api/admin`: only for admins
    + `api/admin/block/:id`: block a user as admin
    + `api/admin/delete/:id`: delete a user as admin

    + `api/questions/`: get all questions
    + `api/questions/:id`: get single question by id
    + `api/questions/ask: ask a question
    + `api/questions/:id/like`: like a question
    + `api/questions/:id/undolike`: undolike a question
    + `api/questions/:id/edit`: edit a question
    + `api/questions/:id/delete`: delete a question
    + `api/questions/:question_id/answers`: view answers of a question by parameter

    + `api/questions/:question_id/answers`: add a answer to a question
    + `api/questions/:question_id/answers``: get all answers by question
    + `api/questions/:question_id/answers/:answer_id`: get a single answer by question
    + `api/questions/:question_id/answers/:answer_id/like`: like a answer 
    + `api/questions/:question_id/answers/:answer_id/undolike`: undolike a answer
    + `api/questions/:question_id/answers/:answer_id/edit`: edit a answer
    + `api/questions/:question_id/answers/:answer_id/delete`: delete a answer

### 7. env file

```
## Environment Variables

PORT = 5000
NODE_ENV=development

## Database Connect Link

MONGO_URL = // your database connect link

## Json Web Token 

JWT_SECRET_KEY= // your secret key for json-web-token
JWT_EXPIRE= // jwt expire

# Cookie

JWT_COOKIE= // jwt cookie expire

# Reset Password

RESET_PASSWORD_EXPIRE= // reset password expire

# NodeMailer

SMTP_SERVER_HOST=smtp.gmail.com
SMTP_SERVER_PORT=587
SMTP_EMAIL= // your e-mail adress
SMTP_PASS= // your e-mail password

```

![env](https://user-images.githubusercontent.com/101933251/172024243-69f1aa4c-cc86-4b70-8ced-03c991f5efb5.JPG)
