# Forum-Project
Welcome to the React Forum project! This web application provides a platform for software developers to share, discuss, and collaborate on various topics related to software development. Built with React, Tailwind CSS, and Firebase Realtime Database, the forum offers a user-friendly interface and essential functionalities for a seamless user experience.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)

## Features

### User Authentication:
- Firebase handles user registration and login, ensuring a secure authentication process.

### Post Management:
- Users can browse, create, like, and comment on posts. 
- Admins have additional capabilities to moderate posts and comments from all users.

### Search Functionality: 
- Easily find posts using the search bar to filter and locate topics of interest.

### Profile Picture Upload: 
- Users can personalize their profiles by uploading a custom profile picture.

## contributors
### The React Forum project was brought to you by the following talented developers:

- Nikolay Hadzhiev
- Atanas Georgiev
- Diana Alemkova


## Usage

1. Register or log in to your account.
2. Browse existing posts or create a new one.
3. Like and comment on posts to engage with the community.
4. Use the search bar to find specific posts.
5. Upload a profile picture to personalize your user profile.

## Installation

Clone the repository:

1. Clone the repository: 
```bash
git clone https://github.com/your-username/react-forum.git
```

2. Navigate to the project directory:
```bash
cd Forum-project
```

3. Install dependencies:
```bash
npm install
```

4. Set up Firebase:
- Create a Firebase project and set up the Realtime Database.
- Configure Firebase authentication for user registration and login.

5. Configure Firebase in the project:
- Replace the Firebase configuration in `src/config/firebase-config.js` with your own Firebase configuration.

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-BaCBpAgtSFQrrnCi-qZV32cAVCCom_E",
  authDomain: "forum-react-e4374.firebaseapp.com",
  databaseURL: "https://forum-react-e4374-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forum-react-e4374",
  storageBucket: "forum-react-e4374.appspot.com",
  messagingSenderId: "2116888903",
  appId: "1:2116888903:web:44e3b56aac3f137dd80462",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const imageDb = getStorage(app);
```

6. Start the development server:
```bash
npm start
```


### Project structure of the documents in the database

```json
{
  "commentsTest": {
    "-NjEcDdZlvec_eJY6jr3": {
      "-NjEt50-TPaF0rCSWLSO": {
        "author": "Nikolay Hadzhiev",
        "content": "test",
        "createdOn": 1699999933290
      }
    },
    "-NjEojD4hStcAiD2a087": {
      "-NjEt3md0zXZzSGyj5cd": {
        "author": "Nikolay Hadzhiev",
        "content": "test",
        "createdOn": 1699999928275
      }
    },
    "-NjEpmwCHSXAyB9AfD3Y": {
      "-NjEstg0PtuK0x7qQWUl": {
        "author": "Nikolay Hadzhiev",
        "content": "test",
        "createdOn": 1699999882795
      },
      "-NjEt06kIXDuVa2YylTk": {
        "author": "Nikolay Hadzhiev",
        "content": "test",
        "createdOn": 1699999913242
      }
    }
  },
  "postsTest": {
    "-NjEcDdZlvec_eJY6jr3": {
      "author": "Atanas Georgiev",
      "content": "qwefqwefqwefqwefqweqwefqwefqwefqwefqwgqwegqweg!!!!!!!!!!!!",
      "createdOn": 1699995511427,
      "title": "fqwefqwefqwefwqefqwefqwefqwef",
      "username": "Atanas"
    },
    "-NjEojD4hStcAiD2a087": {
      "author": "Diana Alemkova",
      "content": "agsfggggggggggggggggggarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrreqrERFqer",
      "createdOn": 1699998789990,
      "lastUpdated": 1699998814197,
      "title": "sdfgfsgsdfgsdgreeeeshssssssfg",
      "username": "Diana"
    },
    "-NjEpmwCHSXAyB9AfD3Y": {
      "author": "Nikolay Hadzhiev",
      "content": "DOM stands for Document Object Model. The DOM represents an HTML document with a logical tree structure. Each branch of the tree ends in a node, and each node contains objects.",
      "createdOn": 1699999068726,
      "likedBy": {
        "nh99": true
      },
      "title": "What is the virtual DOM?",
      "username": "nh99"
    },
    "-NjEvdlukGXFVw5ZXN_j": {
      "author": "Nikolay Hadzhiev",
      "content": "Web browsers cannot read JSX directly. This is because they are built to only read regular JS objects and JSX is not a regular JavaScript object \nFor a web browser to read a JSX file, the file needs to be transformed into a regular JavaScript object. For this, we use Babel",
      "createdOn": 1700000604068,
      "likedBy": {
        "nh99": true
      },
      "title": "Can web browsers read JSX directly? ",
      "username": "nh99"
    }
  },
  "users": {
    "Atanas": {
      "createdOn": 1699988213719,
      "email": "atanasgeorgiev444@gmail.com",
      "firstName": "Atanas",
      "handle": "Atanas",
      "isBlocked": false,
      "lastName": "Georgiev",
      "phoneNumber": "",
      "role": "admin",
      "uid": "pgMSOQ1WYGWe5YhypvDar6GCIRH3"
    },
    "Diana": {
      "createdOn": 1699998344331,
      "email": "diana.alemkova@gmail.com",
      "firstName": "Diana",
      "handle": "Diana",
      "isBlocked": false,
      "lastName": "Alemkova",
      "phoneNumber": "",
      "role": "user",
      "uid": "ewUtgZVDC8VgaP5p3gT8PTFDttw2"
    },
    "nh99": {
      "createdOn": 1699998990462,
      "email": "nhadzhiev99@gmail.com",
      "firstName": "Nikolay",
      "handle": "nh99",
      "isBlocked": false,
      "lastName": "Hadzhiev",
      "likedPosts": {
        "-NjEpmwCHSXAyB9AfD3Y": true,
        "-NjEvdlukGXFVw5ZXN_j": true
      },
      "phoneNumber": "",
      "role": "user",
      "uid": "faQzQQhNqFMCfsV1edIVL0YiZHn2"
    }
  }
}
``
Thank you for using the React Forum! Happy coding! 🚀