
const defaultSubjects = [
    { name: "Operating Systems" },
    { name: "Web Technologies" },
    { name: "Finance" },
    { name: "Analytical Methods" }
];

const defaultTasks = [
    { name: "Complete Linux assignment", subject: "Operating Systems", date: "2026-11-10", completed: false },
    { name: "Create the Tasks page", subject: "WEB Technologies 1", date: "2026-11-12", completed: true },
    { name: "Review the Bridge pattern", subject: "Software Design Patterns", date: "2026-11-15", completed: false }
];

let tasks = [];


function loadDashboardSubjects() {
    const saved = localStorage.getItem("subjects");

    let subjects = defaultSubjects;

    if (saved !== null) {
        try {
            subjects = JSON.parse(saved);

            if (!Array.isArray(subjects)) {
                subjects = defaultSubjects;
            }
        } catch (error) {
            subjects = defaultSubjects;
        }
    }

    const select = document.getElementById("dashboard-subject");

    select.innerHTML = '<option value="">Choose subject</option>';

    for (let i = 0; i < subjects.length; i++) {
        if (!subjects[i] || typeof subjects[i].name !== "string") {
            continue;
        }

        const option = document.createElement("option");

        option.value = subjects[i].name;
        option.textContent = subjects[i].name;

        select.appendChild(option);
    }
}


function loadTasks() {
    const saved = localStorage.getItem("studyPlannerTasks");

    if (saved === null) {
        tasks = defaultTasks;
    } else {
        try {
            tasks = JSON.parse(saved);

            if (!Array.isArray(tasks)) {
                tasks = defaultTasks;
            }
        } catch (error) {
            tasks = defaultTasks;
        }
    }
}

function saveTasks() {
    localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
}

function todayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function showDashboard() {
    loadTasks();

    const today = todayString();
    const todayList = document.querySelector(".task-list");
    const deadlineList = document.querySelector(".deadline-list");
    const progressBar = document.querySelector(".progress-value");

    todayList.innerHTML = "";
    deadlineList.innerHTML = "";

    let todayCount = 0;
    let completed = 0;
    let upcoming = [];

    for (const task of tasks) {
        if (task.completed === true) {
            completed++;
        }

        if (task.date === today) {
            todayCount++;

            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                saveTasks();
                showDashboard();
            });

            label.append(checkbox, " " + task.name);
            todayList.appendChild(label);
        }

        if (task.completed === false && task.date >= today) {
            upcoming.push(task);
        }
    }

    if (todayCount === 0) {
        todayList.textContent = "No tasks for today 💗";
    }

    for (let i = 0; i < upcoming.length; i++) {
        for (let j = i + 1; j < upcoming.length; j++) {
            if (upcoming[j].date < upcoming[i].date) {
                const temp = upcoming[i];
                upcoming[i] = upcoming[j];
                upcoming[j] = temp;
            }
        }
    }

    let limit = upcoming.length;

    if (limit > 5) {
        limit = 5;
    }

    for (let i = 0; i < limit; i++) {
        const paragraph = document.createElement("p");
        const date = document.createElement("span");

        paragraph.textContent = upcoming[i].name + " ";
        date.textContent = upcoming[i].date;

        paragraph.appendChild(date);
        deadlineList.appendChild(paragraph);
    }

    if (upcoming.length === 0) {
        deadlineList.textContent = "No upcoming deadlines";
    }

    let percent = 0;

    if (tasks.length > 0) {
        percent = Math.round(completed / tasks.length * 100);
    }
    
    
let pending = 0;
let overdue = 0;

for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed === false) {
        pending++;

        if (tasks[i].date < today) {
            overdue++;
        }
    }
}

document.getElementById("total-count").textContent =
    tasks.length;

document.getElementById("completed-count").textContent =
    completed;

document.getElementById("pending-count").textContent =
    pending;

document.getElementById("overdue-count").textContent =
    overdue;

const details = document.querySelector(".statistics-details");

if (!details.hidden) {
    showStatistics(details.dataset.type);
}


    progressBar.style.width = percent + "%";
    progressBar.setAttribute("aria-label", percent + "% completed");

    document.querySelector(".progress p").textContent =
        "Overall Progress: " + percent + "%";
}

document.querySelector(".task-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const inputs = this.querySelectorAll("input");

    const subject = document.getElementById("dashboard-subject").value;
    const name = inputs[0].value.trim();
    const date = inputs[1].value;

    let error = this.querySelector(".dashboard-error");

    if (error === null) {
        error = document.createElement("p");
        error.className = "dashboard-error";
        this.appendChild(error);
    }

    error.style.color = "#c0395a";

    if (subject === "") {
        error.textContent = "Please choose a subject.";
        return;
    }

    if (name.length < 3) {
        error.textContent = "Task must contain at least 3 characters.";
        return;
    }

    if (date === "" || date < todayString()) {
        error.textContent = "Choose today or a future date.";
        return;
    }

    loadTasks();

    const newTask = {
        name: name,
        subject: subject,
        date: date,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    this.reset();

    error.style.color = "#398052";
    error.textContent = "Task added successfully!";

    showDashboard();

    $(this).closest("details").delay(500).fadeOut(200, function () {
        this.open = false;
        $(this).show();
    });
});

window.addEventListener("pageshow", function () {
    loadDashboardSubjects();
    showDashboard();
});

loadDashboardSubjects();
showDashboard();


function showStatistics(type) {
    loadTasks();

    const details = document.querySelector(".statistics-details");
    const title = document.getElementById("statistics-title");
    const list = document.getElementById("statistics-list");

    const today = todayString();

    details.hidden = false;
    details.dataset.type = type;
    list.innerHTML = "";

    title.textContent =
        type.charAt(0).toUpperCase() + type.slice(1) + " Tasks";

    let count = 0;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let show = false;

        if (type === "total") {
            show = true;
        }

        if (type === "completed" && task.completed === true) {
            show = true;
        }

        if (type === "pending" && task.completed === false) {
            show = true;
        }

        if (type === "overdue" &&
            task.completed === false &&
            task.date < today) {
            show = true;
        }

        if (show === true) {
            count++;

            const item = document.createElement("div");
            item.className = "statistics-item";

            const name = document.createElement("strong");
            name.textContent = task.name;

            const info = document.createElement("p");
            info.textContent = task.subject + " | " + task.date;

            item.appendChild(name);
            item.appendChild(info);

            list.appendChild(item);
        }
    }

    if (count === 0) {
        list.textContent = "No tasks found.";
    }
}

const statButtons = document.querySelectorAll(".stat-card");

for (let i = 0; i < statButtons.length; i++) {
    statButtons[i].addEventListener("click", function() {
        const type = this.dataset.type;

        const details = document.querySelector(".statistics-details");

        if (!details.hidden && details.dataset.type === type) {
            details.hidden = true;
        } else {
            showStatistics(type);
        }
    });
}

