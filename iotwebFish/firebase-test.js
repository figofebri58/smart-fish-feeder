import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    set
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {

  apiKey: "AIzaSyDT4BvBUKhdHLej4kn5CmERQ1k6StpZwdM",

  authDomain:
  "smart-fish-feeder-f923c.firebaseapp.com",

  databaseURL:
  "https://smart-fish-feeder-f923c-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId:
  "smart-fish-feeder-f923c",

  storageBucket:
  "smart-fish-feeder-f923c.firebasestorage.app",

  messagingSenderId:
  "886164078179",

  appId:
  "1:886164078179:web:cdeb2c7807f56699c80256"

};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

set(ref(db,"test"),{

    status:"Firebase Connected"

});

console.log("Firebase Connected");