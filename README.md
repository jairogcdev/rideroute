# Rideroute

## [See the App!](https://rideroute.netlify.app)

![App Logo](https://github.com/dsanchezva/rideroute-client/blob/15d9c4f4d49484574792ef3715b2f921b902ba27/public/images/letter.png)

## Description

Web application that allows you to share motorcycle routes with other users, on the routes you can interact with comments. The application allows the creation of these routes by adding the name of the town of origin and destination.

#### [Client Repo here](https://github.com/dsanchezva/rideroute-client)

#### [Server Repo here](https://github.com/jairogcdev/rideroute-server)

## Backlog Functionalities

**NOTE -** List here all functionalities you wish to add to your proyect later or that you are currently working on

## Technologies used

**NOTE -** List here all technologies used in the project like HTML, CSS, Javascript, Express, React, axios, React Context etc.

# Server Structure

## Models

User model

```javascript
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, enum: ["user", "admin"], default: "user"},
  motoMake: {type: String, default: ""},
  motoModel: {type: String, default: ""},
  motoYear: {type: Number},
  userPicture: {type: String, default: "https://img2.freepng.es/20180722/gfc/kisspng-user-profile-2018-in-sight-user-conference-expo-5b554c0968c377.0307553315323166814291.jpg"},
  motoPicture: {type: String, default: "https://www.inforchess.com/images/motocicletas/ducati-gp-0027.jpg"},
}
```

MotoRoute model

```javascript
{
  description: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: "User"},
  origin: {type: [Number], required: true},
  destiny: {type: [Number], required: true},
  country: {type: String, required: true},
}
```

Comment model

```javascript
{
  comment: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: "User"},
  route: {type: Schema.Types.ObjectId, ref: "Route"}
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                                 | Request Body                                  | Success status | Error Status | Description                                    |
| ----------- | ----------------------------------- | --------------------------------------------- | -------------- | ------------ | ---------------------------------------------- |
| POST        | `/user/signup`                      | {name, email, password}                       | 200            | 400          | Registers the user in the Database             |
| POST        | `/user/login`                       | {username, password}                          | 200            | 400          | Validates credentials, creates and sends Token |
| GET         | `/user/verify`                      |                                               | 200            | 400          | Verifies the user Token                        |
| PATCH       | `/user/editUser`                    | {username, email}                             | 200            | 400          | Updates the username and email in the Database |
| PATCH       | `/user/editMoto`                    | {maker}                                       | 200            |              | Returns the list of models by maker            |
| PATCH       | `/user/editMotorbikeDetails`        | {make,model,year}                             | 200            |              | Updates the details of a motorbike             |
| PATCH       | `/user/editUserPicture`             | {userPicture}                                 | 200            |              | Updates the user picture                       |
| PATCH       | `/user/uploadUserPicture`           |                                               | 200            |              | Uploads the user picture                       |
| PATCH       | `/user/editMotorbikePicture`        | {motoPicture}                                 | 200            |              | Updates the motorbike picture                  |
| PATCH       | `/user/uploadMotoPicture`           |                                               | 200            |              | Uploads the motorbike picture                  |
| DELETE      | `/user/delete`                      |                                               | 200            |              | Deletes the user account                       |
| GET         | `/user/details`                     |                                               | 200            |              | Obtains user details                           |
| POST        | `/routes/create`                    | {description, user, origin, destiny, country} | 200            | 400          | Creates a new route                            |
| PATCH       | `/routes/coordinates/searchOrigin`  | {name, country}                               | 200            | 400          | Returns the origin latitude and longitude      |
| PATCH       | `/routes/coordinates/searchDestiny` | {name, country}                               | 200            | 400          | Returns the destiny latitude and longitude     |
| PATCH       | `/routes/:routeId/editRoute`        | {description, origin, destiny}                | 200            | 400          | Updates origin and destiny for a route         |
| DELETE      | `/routes/:routeId/delete`           |                                               | 200            | 400          | Deletes the route                              |
| PATCH       | `/routes/all`                       | {sendPage, pageSize}                          | 200            |              | Lists all routes                               |
| PATCH       | `/routes/search`                    | {value}                                       | 200            |              | Search routes by username                      |
| GET         | `/routes/:routeId/info`             |                                               | 200            |              | Obtains route information                      |
| GET         | `/comment/:commentId`               |                                               | 200            | 400          | Obtains a comment by id                        |
| POST        | `/comment/:routeId/create`          | {comment}                                     | 200            | 400          | Creates a comment in a route                   |
| GET         | `/api/comment/:routeId/allComments` |                                               | 200            |              | Shows all comments in a route                  |
| PATCH       | `/comment/:commentId/edit`          | {comment}                                     | 200            | 400          | Updates a comment                              |
| DELETE      | `/comment/:commentId/delete`        |                                               | 200            | 400          | Deletes a comment                              |

## Links

### Collaborators

[Jairo García](https://github.com/jairogcdev)

[David Sánchez](https://github.com/dsanchezva)

### Project

[Repository Link Client](https://github.com/dsanchezva/rideroute-client)

[Repository Link Server](https://github.com/jairogcdev/rideroute-server)

[Deploy Link](https://rideroute.netlify.app)

### Excalidraw

![Excalidraw Plan](https://github.com/dsanchezva/rideroute-client/blob/cfcc9b1028418cdbbfaafb34357cbcd0fb534874/public/images/excalidraw.png)

### Slides

[Slides Link](https://docs.google.com/presentation/d/1c53eW2G7djpTyzk2GM6M9eAocRtZRsRAfIfSqO9OXM8/edit?usp=sharing)
