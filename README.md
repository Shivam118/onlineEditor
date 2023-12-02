# Getting Started with the Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [ExpressJS](https://expressjs.com/en/5x/api.html) powered by Node Runtime v18.0.0.

## Available Scripts

In the project directory, you have to run npm install 3 times for different directories:

Complete Project - [_within root directory_] - to Install Turbo CLI

```
npm install
```

Frontend - [_client directory_] - to Install ReactJS

```
cd .\apps\client
npm install
```

Backend - [_server directory_] - to Install ExpressJS

```
cd .\apps\server
npm install
```

To Initialize the project, you have to run the following command from root directory:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

As, The Project is based on Open Connection, the Socket will be opened and connected on the 3001 port. Keep it in mind, that the port 3001 should be free.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Usage

The Project is a simple Online Document Editor with a Login System powered by Google OAuth by Firebase.

## Project Structure

```bash
├───apps
│   ├───server
│   │   └───src
│   │       ├───models
│   │       │   ├────connection.js
│   │       │   └────docSchema.js
│   │       ├───routes
│   │       └────server.js
│   └───client
│       ├───public
│       └───src
│           ├───components
│           ├───pages
│           ├───assets
├           ├───context
│           └───utils
└───node_modules
```

## Project Description

The Project is a simple Online Document Editor with a Login System powered by Google OAuth by Firebase.

For Collaborative Editing, Socket.Io is used to create a open connection between the server and the client.

I have used [QuillJS](https://quilljs.com/) as the Rich Text Editor to provide the user with a better experience.

For Now, multiple contributors can edit the document at the same time, and the changes are visible to other users.
But the cursors are not visible to other users, as it is not implemented yet. [Only 1 cursor can be visible at a time (even if there were more than 2 users working at the same time)].

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
