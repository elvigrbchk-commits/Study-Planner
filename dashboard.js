
function loadDashboardSubjects() {
    const saved = localStorage.getItem("subjects");

    const defaultSubjects = [
        { name: "Operating Systems" },
        { name: "Web Technologies" },
        { name: "Finance" },
        { name: "Analytical Methods" }
    ];

    const subjects = saved === null
        ? defaultSubjects
        : JSON.parse(saved);

    const select = document.getElementById("dashboard-subject");

    select.innerHTML = '<option value="">Choose subject</option>';

    for (const subject of subjects) {
        const option = document.createElement("option");
        option.value = subject.name;
        option.textContent = subject.name;
        select.appendChild(option);
    }
}


const defaultTasks = [
    { name: "Complete Linux assignment", subject: "Operating Systems", date: "2026-11-10", completed: false },
    { name: "Create the Tasks page", subject: "WEB Technologies 1", date: "2026-11-12", completed: true },
    { name: "Review the Bridge pattern", subject: "Software Design Patterns", date: "2026-11-15", completed: false }
];

let tasks = [];

function loadTasks() {
    try {
        const saved = localStorage.getItem("studyPlannerTasks");
        tasks = saved === null ? defaultTasks : JSON.parse(saved);
        if (!Array.isArray(tasks)) tasks = [];
    } catch (error) {
        tasks = [];
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
    return `${year}-${month}-${day}`;
}

function showDashboard() {
    loadTasks();

    const today = todayString();
    const todayList = document.querySelector(".task-list");
    const deadlineList = document.querySelector(".deadline-list");
    const progressBar = document.querySelector(".progress-value");

    todayList.innerHTML = "";
    deadlineList.innerHTML = "";

    const todayTasks = tasks.filter(task => task.date === today);
    const upcomingTasks = tasks
        .filter(task => !task.completed && task.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5);

    for (const task of todayTasks) {
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

    if (todayTasks.length === 0) {
        todayList.textContent = "No tasks for today 💗";
    }

    for (const task of upcomingTasks) {
        const paragraph = document.createElement("p");
        const date = document.createElement("span");

        paragraph.textContent = task.name + " ";
        date.textContent = task.date;
        paragraph.appendChild(date);
        deadlineList.appendChild(paragraph);
    }

    if (upcomingTasks.length === 0) {
        deadlineList.textContent = "No upcoming deadlines";
    }

    const completed = tasks.filter(task => task.completed).length;
    const percent = tasks.length === 0
        ? 0
        : Math.round(completed / tasks.length * 100);

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

    if (!error) {
        error = document.createElement("p");
        error.className = "dashboard-error";
        error.style.color = "#c0395a";
        this.appendChild(error);
    }

    if (subject.length < 2) {
        error.textContent = "Enter a valid subject.";
        return;
    }

    if (name.length < 3) {
        error.textContent = "Task must contain at least 3 characters.";
        return;
    }

    if (!date || date < todayString()) {
        error.textContent = "Choose today or a future date.";
        return;
    }

    loadTasks();
    tasks.push({ name, subject, date, completed: false });
    saveTasks();

    this.reset();
    error.style.color = "#398052";
    error.textContent = "Task added successfully!";

    showDashboard();

    // Close the Add Task panel after saving
    $(this).closest("details").delay(500).fadeOut(200, function () {
        this.open = false;
        $(this).show();
    });
});

window.addEventListener("pageshow", function () {
    loadDashboardSubjects();
    showDashboard();
});