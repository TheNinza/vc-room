# VC-Room

A video call application made with [React.js](https://reactjs.org/) + [Firebase](https://firebase.google.com/) + [WebRTC](https://webrtc.org/)

![GitHub last commit](https://img.shields.io/github/last-commit/theninza/vc-room?style=for-the-badge)&nbsp;
![GitHub issues](https://img.shields.io/github/issues/theninza/vc-room?style=for-the-badge)&nbsp;
![GitHub repo size](https://img.shields.io/github/repo-size/theninza/vc-room?style=for-the-badge)

## Tech-Stack

![React](https://img.shields.io/badge/React-05122A?style=for-the-badge&logo=react)&nbsp;
![Firebase](https://img.shields.io/badge/-Firebase-05122A?style=for-the-badge&logo=firebase)&nbsp;
![Redux](https://img.shields.io/badge/Redux-05122A?style=for-the-badge&logo=redux)&nbsp;
![React-Router](https://img.shields.io/badge/React_Router-05122A?style=for-the-badge&logo=react-router)&nbsp;
![React-Router](https://img.shields.io/badge/Material--UI-05122A?style=for-the-badge&logo=material-ui)&nbsp;

## Goals

:white_check_mark: User SignIn.

:white_check_mark: Friend Request.

:white_check_mark: Friend List.

:white_check_mark: Incomming Call And Outgoing Call Notifications.

:white_check_mark: Incomming Call And Outgoing Call Notifications.

:white_large_square: Creating Actual Video Call

:white_large_square: Mobile Responsiveness

## Local Setup

1. Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/TheNinza/vc-room.git
cd vc-room/client
npm install
```

2. Create a firebase web project in your firebase console and enable google authentication and firestore.

3. Setup environment variables. Make Sure you are in the client folder and create .env file there with following vairables and their values from firebase.

```env
REACT_APP_FIREBASE_API_KEY = <VALUE>
REACT_APP_FIREBASE_AUTH_DOMAIN = <VALUE>
REACT_APP_FIREBASE_PROJECT_ID = <VALUE>
REACT_APP_FIREBASE_STORAGE_BUCKET = <VALUE>
REACT_APP_FIREBASE_MESSANGING_SENDER_ID = <VALUE>
REACT_APP_FIREBASE_APP_ID = <VALUE>
REACT_APP_FIREBASE_MEASUREMENT_ID = <VALUE>
```

4. Start the development server from the Client folder.

```sh
npm start
```
