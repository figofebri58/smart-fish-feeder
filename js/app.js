import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    remove,
    update
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

const app =
initializeApp(firebaseConfig);

const db =
getDatabase(app);

function loadSchedules(){

    const scheduleRef =
    ref(db,"schedules");

    onValue(scheduleRef,(snapshot)=>{

        schedules = [];

        if(snapshot.exists()){

            snapshot.forEach((child)=>{

                schedules.push({

                    id: child.key,

                    time: child.val().time

                });

            });

        }

        renderSchedules();

    });

}

let schedules = [];

let editIndex = null;

let historyData = [];

loadSchedules();
loadFeedStatus();
loadHistory();

setInterval(
    checkFeedingTime,
    1000
);

let currentPage = 1;
const rowsPerPage = 10;

renderSchedules();
renderHistory();

function checkFeedingTime(){

    const now =
    new Date();

    const currentTime =
    now.getHours()
        .toString()
        .padStart(2,'0')
    + ":"
    +
    now.getMinutes()
        .toString()
        .padStart(2,'0');

    let feedingNow =
    false;

    schedules.forEach(item=>{

        if(item.time===currentTime){

            feedingNow = true;

        }

    });

    const statusElement =
    document.getElementById(
        "feedingStatus"
    );

    if(feedingNow){

        statusElement.innerText =
        "Waktunya feeding, cek kolam ikanmu";

    }
    else{

        statusElement.innerText =
        "Belum waktunya feeding";

    }

}

function renderSchedules(){

    const container =
    document.getElementById("scheduleContainer");

    container.innerHTML = "";

    schedules.forEach((item,index)=>{

        container.innerHTML += `

        <div class="schedule-card">

            <strong>${item.time}</strong>

            <div class="schedule-actions">

                <button
                class="edit-btn"
                onclick="editSchedule(${index})">
                Edit
                </button>

                <button
                class="delete-btn"
                onclick="deleteSchedule(${index})">
                Hapus
                </button>

            </div>

        </div>

        `;

    });

}

function openAddModal(){

    editIndex = null;

    document.getElementById(
    "modalTitle").innerText =
    "Tambah Jadwal";

    document.getElementById(
    "scheduleTime").value = "";

    document.getElementById(
    "scheduleModal").style.display =
    "block";

}

function closeModal(){

    document.getElementById(
    "scheduleModal").style.display =
    "none";

}

function saveSchedule(){

    const time =
    document.getElementById(
    "scheduleTime").value;

    if(time==="") return;

    if(editIndex===null){

        const scheduleRef =
        ref(db,"schedules");

        const newSchedule =
        push(scheduleRef);

        set(newSchedule,{

            time: time

        });

    }
    else{

        const id =
        schedules[editIndex].id;

        update(
            ref(
                db,
                "schedules/"+id
            ),
            {
                time: time
            }
        );

    }

    closeModal();

}

function editSchedule(index){

    editIndex = index;

    document.getElementById(
    "modalTitle").innerText =
    "Edit Jadwal";

    document.getElementById(
    "scheduleTime").value =
    schedules[index].time;

    document.getElementById(
    "scheduleModal").style.display =
    "block";

}

function deleteSchedule(index){

    if(confirm("Hapus jadwal ini?")){

        const id =
        schedules[index].id;

        remove(
            ref(
                db,
                "schedules/"+id
            )
        );

    }

}

function renderHistory(){

    const table =
    document.getElementById(
    "historyTable");

    table.innerHTML = "";

    const start =
    (currentPage-1) * rowsPerPage;

    const end =
    start + rowsPerPage;

    const rows =
    historyData.slice(start,end);

    rows.forEach(item=>{

        table.innerHTML += `

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.waktu}</td>

            <td>${item.sudut}</td>

            <td>${item.berat}</td>

            <td>${item.status}</td>

        </tr>

        `;

    });

    document.getElementById(
    "pageNumber").innerText =
    currentPage;

}

function nextPage(){

    const maxPage =
    Math.ceil(
    historyData.length /
    rowsPerPage);

    if(currentPage < maxPage){

        currentPage++;

        renderHistory();

    }

}

function previousPage(){

    if(currentPage > 1){

        currentPage--;

        renderHistory();

    }

}

function manualFeed(){

    const angle =
    parseInt(
        document.getElementById(
            "servoAngle"
        ).value
    );

    set(
        ref(db,"manualFeed"),
        {
            angle: angle,
            trigger: true
        }
    );

    alert(
        "Perintah feeding dikirim: "
        + angle +
        "°"
    );

}

function loadFeedStatus(){

    const feedRef =
    ref(db,"feedstatus");

    onValue(feedRef,(snapshot)=>{

        console.log(snapshot.val());

        if(snapshot.exists()){

            const data =
            snapshot.val();

            document.getElementById(
                "weightValue"
            ).innerText =
            data.feedWeight + " gram";

            document.getElementById(
                "stockStatus"
            ).innerText =
            data.stockStatus;

        }

    });

}

function loadHistory(){

    const historyRef =
    ref(db,"history");

    onValue(historyRef,(snapshot)=>{

        historyData = [];

        if(snapshot.exists()){

            snapshot.forEach((child)=>{

                historyData.push({

                    id: child.key,

                    ...child.val()

                });

            });

        }

        historyData.reverse();

        renderHistory();

    });

}

window.openAddModal = openAddModal;
window.closeModal = closeModal;
window.saveSchedule = saveSchedule;
window.editSchedule = editSchedule;
window.deleteSchedule = deleteSchedule;
window.manualFeed = manualFeed;
window.loadSchedules = loadSchedules;
window.loadFeedStatus = loadFeedStatus;