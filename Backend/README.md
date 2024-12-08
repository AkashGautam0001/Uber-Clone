# Backend API Documentation

## Overview

This is the backend API for the Uber Clone application. It provides endpoints for user registration, login, and other user-related operations.

#### Register User

- **URL:** `/users/register`
- **Method:** `POST`
- **Request Body:**

```json
{
  "fullName": {
    "firstName": "Akash",
    "lastName": "Gautam"
  },
  "email": "akashgautam@uber.com",
  "password": "test12345"
}
```

- **Response:**

```json
{
  "token": "generated-token",
  "user": {
    "_id": "user-id",
    "fullName": {
      "firstName": "Akash",
      "lastName": "Gautam"
    },
    "email": "akashgautam@uber.com"
  }
}
```

#### Login User

- **URL:** `/users/login`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "akashgautam@uber.com",
  "password": "test12345"
}
```

- **Response:**

```json
{
  "token": "generated-token",
  "user": {
    "_id": "user-id",
    "fullName": {
      "firstName": "Akash",
      "lastName": "Gautam"
    },
    "email": "akashgautam@uber.com"
  }
}
```

## Models

### User Model

- **File:** `user.model.js`
- **Description:** Defines the user schema and model for the application.

## Controllers

### User Controller

- **File:** `user.controller.js`
- **Description:** Handles user-related operations, including registration and login.

## Services

### User Service

- **File:** `user.services.js`
- **Description:** Provides business logic for user-related operations, including registration and login.

## Routes

### User Route

- **File:** `user.route.js`
- **Description:** Defines the routes for user-related operations, including registration and login.

#### Login User

- **URL:** `/users/login`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "akashgautam@uber.com",
  "password": "test12345"
}
```

- **Response:**

  - **Status Code:** `200 OK`
  - **Body:**

  ```json
  {
    "token": "generated-token",
    "user": {
      "_id": "user-id",
      "fullName": {
        "firstName": "Akash",
        "lastName": "Gautam"
      },
      "email": "akashgautam@uber.com"
    }
  }
  ```

  - **Status Code:** `401 Unauthorized`
  - **Body:**

  ```json
  {
    "message": "Invalid email or password"
  }
  ```

  - **Status Code:** `400 Bad Request`
  - **Body:**

  ```json
  {
    "errors": [
      {
        "msg": "Please enter a valid email address",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 8 characters long",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### View Profile

- **URL:** `/users/profile`
- **Method:** `GET`
- **Request Header:**

  - **Authorization:** `Bearer <token>`

- **Response:**

  - **Status Code:** `200 OK`
  - **Body:**

  ```json
  {
    "_id": "user-id",
    "fullName": {
      "firstName": "Akash",
      "lastName": "Gautam"
    },
    "email": "akashgautam@uber.com"
  }
  ```

#### Logout User

- **URL:** `/users/logout`
- **Method:** `POST`
- **Request Header:**

  - **Authorization:** `Bearer <token>`

- **Response:**

  - **Status Code:** `200 OK`
  - **Body:**

  ```json
  {
    "message": "Successfully logged out"
  }
  ```
