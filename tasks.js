
const defaultSubjects = [
    { name: "Operating Systems", description: "Linux commands and shell scripts." },
    { name: "Web Technologies", description: "HTML, CSS and responsive web design." },
    { name: "Finance", description: "Financial statements and analysis." },
    { name: "Analytical Methods", description: "Probability and analytical methods." }
];

const defaultTasks = [
    { name: "Complete Linux assignment", subject: "Operating Systems", date: "2026-11-10", completed: false },
    { name: "Create the Tasks page", subject: "WEB Technologies 1", date: "2026-11-12", completed: true },
    { name: "Review the Bridge pattern", subject: "Software Design Patterns", date: "2026-11-15", completed: false }
];

let subjects = [];
let tasks = [];

function loadSubjects() {
    const saved = localStorage.getItem("subjects");

    if (saved === null) {
        subjects = defaultSubjects;
    } else {
        subjects = JSON.parse(saved);
    }

    const select = document.getElementById("new-task-subject");
    select.innerHTML = '<option value="">Choose subject</option>';

    for (const subject of subjects) {
        const option = document.createElement("option");
        option.value = subject.name;
        option.textContent = subject.name;
        select.appendChild(option);
    }
}

function loadTasks() {
    const saved = localStorage.getItem("studyPlannerTasks");

    if (saved === null) {
        tasks = defaultTasks;
    } else {
        tasks = JSON.parse(saved);
    }
}

function saveTasks() {
    localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
}

function calculateProgress() {
    if (tasks.length === 0) {
        return 0;
    }

    let completed = 0;

    for (const task of tasks) {
        if (task.completed === true) {
            completed++;
        }
    }

    return Math.round(completed / tasks.length * 100);
}

function showTasks() {
    const list = document.getElementById("tasks-list");
    const filter = document.getElementById("task-filter").value;

    list.innerHTML = "";
    let visibleTasks = 0;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (filter === "completed" && task.completed === false) {
            continue;
        }

        if (filter === "pending" && task.completed === true) {
            continue;
        }

        visibleTasks++;

        const item = document.createElement("article");
        item.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete " + task.name);

        checkbox.addEventListener("change", function () {
            tasks[i].completed = checkbox.checked;
            saveTasks();
            showTasks();
        });

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.name;

        if (task.completed === true) {
            title.style.textDecoration = "line-through";
            title.style.color = "#8c777b";
        }

        const subject = document.createElement("p");
        subject.textContent = task.subject;

        const date = document.createElement("span");
        date.textContent = "Due: " + task.date;

        info.append(title, subject, date);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks.splice(i, 1);
            saveTasks();
            showTasks();
        });

        item.append(checkbox, info, deleteButton);
        list.appendChild(item);
    }

    if (visibleTasks === 0) {
        list.innerHTML = "<p class='empty-tasks'>No tasks found 💗</p>";
    }

    updateSummary();
    showSubjectCards();
}

function updateSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayText = today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let todayCount = 0;
    let upcomingCount = 0;

    for (const task of tasks) {
        if (task.completed === false) {
            if (task.date === todayText) {
                todayCount++;
            }

            const dueDate = new Date(task.date + "T00:00:00");

            if (dueDate >= today && dueDate <= nextWeek) {
                upcomingCount++;
            }
        }
    }

    document.getElementById("today-count").textContent = todayCount;
    document.getElementById("upcoming-count").textContent = upcomingCount;
    document.getElementById("progress-percent").textContent =
        calculateProgress() + "%";
}

function validateTask() {
    const name = document.getElementById("new-task-title").value.trim();
    const subject = document.getElementById("new-task-subject").value;
    const date = document.getElementById("new-task-date").value;

    const titleError = document.getElementById("task-title-error");
    const subjectError = document.getElementById("task-subject-error");
    const dateError = document.getElementById("task-date-error");

    titleError.textContent = "";
    subjectError.textContent = "";
    dateError.textContent = "";

    let valid = true;

    if (name.length < 3) {
        titleError.textContent = "Please enter at least 3 characters.";
        valid = false;
    }

    if (subject === "") {
        subjectError.textContent = "Please choose a subject.";
        valid = false;
    }

    if (date === "") {
        dateError.textContent = "Please select a deadline.";
        valid = false;
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(date + "T00:00:00");

        if (selectedDate < today) {
            dateError.textContent = "Deadline cannot be in the past.";
            valid = false;
        }
    }

    return valid;
}

document.getElementById("add-task-form").addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateTask() === false) {
        document.getElementById("task-feedback").textContent =
            "Please fix the errors above.";
        return;
    }

    const name = document.getElementById("new-task-title").value.trim();
    const subject = document.getElementById("new-task-subject").value;
    const date = document.getElementById("new-task-date").value;

    const newTask = {
        name: name,
        subject: subject,
        date: date,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    document.getElementById("task-filter").value = "all";
    showTasks();
    this.reset();

    $("#add-task-form").hide();
    $("#add-task-form").prop("hidden", true);

    $("#task-feedback")
        .stop(true, true)
        .text("Task added successfully! 💗")
        .hide()
        .fadeIn(300)
        .delay(2500)
        .fadeOut(500);
});

document.getElementById("task-filter").addEventListener("change", function () {
    showTasks();
});

const focus = document.getElementById("daily-focus");

focus.value = localStorage.getItem("studyPlannerFocus") || "";

focus.addEventListener("input", function () {
    localStorage.setItem("studyPlannerFocus", focus.value);
});

const goals = document.querySelectorAll(".goal-item input");

for (const goal of goals) {
    const key = "studyGoal-" + goal.id;

    goal.checked = localStorage.getItem(key) === "true";

    goal.addEventListener("change", function () {
        localStorage.setItem(key, goal.checked);
    });
}

$("#show-task-form").on("click", function () {
    const form = $("#add-task-form");

    if (form.prop("hidden")) {
        form.prop("hidden", false);
        form.hide().slideDown(300);
    } else {
        form.slideUp(300, function () {
            form.prop("hidden", true);
        });
    }
});

$(".goals-card input").on("change", function () {
    const goal = $(this).closest(".goal-item");
    const label = goal.find("label");

    label.fadeOut(150).fadeIn(150);
});

function showSubjectCards() {
    const container = document.querySelector(".subject-cards");
    container.innerHTML = "";

    for (const subject of subjects) {
        const card = document.createElement("article");
        card.className = "subject-card";

        const title = document.createElement("h3");
        title.textContent = subject.name;

        const description = document.createElement("p");
        description.textContent = subject.description || "";

        let count = 0;

        for (const task of tasks) {
            if (task.subject === subject.name) {
                count++;
            }
        }

        const number = document.createElement("p");
        number.textContent = count + " Tasks";

        card.append(title, description, number);
        container.appendChild(card);
    }
}

window.addEventListener("pageshow", function () {
    loadSubjects();
    loadTasks();
    showTasks();
});

loadSubjects();
loadTasks();
showTasks();
