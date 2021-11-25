# VC-Room

A video call application made with [React.js](https://reactjs.org/) + [Firebase](https://firebase.google.com/) + [WebRTC](https://webrtc.org/)

![GitHub last commit](https://img.shields.io/github/last-commit/theninza/vc-room?style=for-the-badge)&nbsp;
![GitHub issues](https://img.shields.io/github/issues/theninza/vc-room?style=for-the-badge)&nbsp;
![GitHub repo size](https://img.shields.io/github/repo-size/theninza/vc-room?style=for-the-badge)

<a href="https://ibb.co/z8sNWcw"><img src="https://i.ibb.co/ZHdNRsC/Screenshot-2021-09-27-at-3-53-19-PM.png" alt="Screenshot-2021-09-27-at-3-53-19-PM" border="0"></a>
<a href="https://ibb.co/vsPFW8x"><img src="https://i.ibb.co/bHB0Vng/Screenshot-2021-09-27-at-3-55-51-PM.png" alt="Screenshot-2021-09-27-at-3-55-51-PM" border="0"></a><br />
<a href="https://ibb.co/kMN0S17"><img src="https://i.ibb.co/V3fDqm1/Frame-4.png" alt="Frame-4" border="0"></a><br />

## Tech-Stack

![React](https://img.shields.io/badge/React-05122A?style=for-the-badge&logo=react)&nbsp;
![Firebase](https://img.shields.io/badge/-Firebase-05122A?style=for-the-badge&logo=firebase)&nbsp;
![Redux](https://img.shields.io/badge/Redux-05122A?style=for-the-badge&logo=redux)&nbsp;
![React-Router](https://img.shields.io/badge/React_Router-05122A?style=for-the-badge&logo=react-router)&nbsp;
![React-Router](https://img.shields.io/badge/Material--UI-05122A?style=for-the-badge&logo=material-ui)&nbsp;

## Goals

:white_check_mark: &nbsp;User SignIn.

:white_check_mark: &nbsp;Friend Request.

:white_check_mark: &nbsp;Friend List.

:white_check_mark: &nbsp;Incomming Call And Outgoing Call Notifications.

:white_check_mark: &nbsp;Creating Actual Video Call

:white_check_mark: &nbsp;Recent Calls

:white_check_mark: &nbsp;Friend Suggestions

:white_check_mark: &nbsp;User Profile Page

:white_large_square: &nbsp;Mobile Responsiveness

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
