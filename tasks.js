let subjects = [];
let tasks = [
    {
        name: "Complete Linux assignment",
        subject: "Operating Systems",
        date: "2026-11-10",
        completed: false
    },
    {
        name: "Create the Tasks page",
        subject: "WEB Technologies 1",
        date: "2026-11-12",
        completed: true
    },
    {
        name: "Review the Bridge pattern",
        subject: "Software Design Patterns",
        date: "2026-11-15",
        completed: false
    }
];

function loadTasks() {
    let saved = localStorage.getItem("studyPlannerTasks");

    if (saved !== null) {
        let data = JSON.parse(saved);

        if (Array.isArray(data)) {
            tasks = data;
        }
    }
}

function saveTasks() {
    localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
}

function loadSubjects() {
    let saved = localStorage.getItem("subjects");

    let subjectList = [
        { name: "Operating Systems", description: "Linux commands and shell scripts." },
        { name: "Web Technologies", description: "HTML, CSS and responsive web design." },
        { name: "Finance", description: "Financial statements and analysis." },
        { name: "Analytical Methods", description: "Probability and analytical methods." }
    ];

    if (saved !== null) {
        let data = JSON.parse(saved);

        if (Array.isArray(data)) {
            subjectList = data;
        }
    }

    subjects = [];

    for (let i = 0; i < subjectList.length; i++) {
        if (!subjects.includes(subjectList[i].name)) {
            subjects.push(subjectList[i].name);
        }
    }

    for (let i = 0; i < tasks.length; i++) {
        if (!subjects.includes(tasks[i].subject)) {
            subjects.push(tasks[i].subject);
        }
    }

    let select = document.getElementById("new-task-subject");
    select.innerHTML = '<option value="">Choose subject</option>';

    for (let i = 0; i < subjects.length; i++) {
        let option = document.createElement("option");
        option.value = subjects[i];
        option.textContent = subjects[i];
        select.appendChild(option);
    }
}

function calculateProgress() {
    if (tasks.length === 0) {
        return 0;
    }

    let completed = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed === true) {
            completed++;
        }
    }

    return Math.round(completed / tasks.length * 100);
}

function updateSummary() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    let todayText = year + "-" + month + "-" + day;

    let nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let todayCount = 0;
    let upcomingCount = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed === false) {
            if (tasks[i].date === todayText) {
                todayCount++;
            }

            let dueDate = new Date(tasks[i].date + "T00:00:00");

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

function showSubjectCards() {
    let container = document.querySelector(".subject-cards");
    container.innerHTML = "";

    let saved = localStorage.getItem("subjects");

    let subjectList = [
        { name: "Operating Systems", description: "Linux commands and shell scripts." },
        { name: "Web Technologies", description: "HTML, CSS and responsive web design." },
        { name: "Finance", description: "Financial statements and analysis." },
        { name: "Analytical Methods", description: "Probability and analytical methods." }
    ];

    if (saved !== null) {
        let data = JSON.parse(saved);

        if (Array.isArray(data)) {
            subjectList = data;
        }
    }

    for (let i = 0; i < subjectList.length; i++) {
        let subject = subjectList[i];

        let card = document.createElement("article");
        card.className = "subject-card";

        let title = document.createElement("h3");
        title.textContent = subject.name;

        let description = document.createElement("p");
        description.textContent = subject.description || "";

        let total = 0;

        for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].subject === subject.name) {
                total++;
            }
        }

        let count = document.createElement("p");
        count.textContent = total + " Tasks";

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(count);

        container.appendChild(card);
    }
}

function showTasks() {
    let list = document.getElementById("tasks-list");
    let filter = document.getElementById("task-filter").value;

    list.innerHTML = "";

    let visible = 0;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        if (filter === "completed" && task.completed === false) {
            continue;
        }

        if (filter === "pending" && task.completed === true) {
            continue;
        }

        visible++;

        let item = document.createElement("article");
        item.className = "task-item";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete " + task.name);

        checkbox.addEventListener("change", function() {
            tasks[i].completed = checkbox.checked;
            saveTasks();
            showTasks();
        });

        let info = document.createElement("div");
        info.className = "task-info";

        let title = document.createElement("h3");
        title.textContent = task.name;

        if (task.completed === true) {
            title.style.textDecoration = "line-through";
            title.style.color = "#8c777b";
        }

        let subject = document.createElement("p");
        subject.textContent = task.subject;

        let date = document.createElement("span");
        date.textContent = "Due: " + task.date;

        info.appendChild(title);
        info.appendChild(subject);
        info.appendChild(date);

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            tasks.splice(i, 1);
            saveTasks();
            showTasks();
        });

        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(deleteButton);

        list.appendChild(item);
    }

    if (visible === 0) {
        let message = document.createElement("p");
        message.className = "empty-tasks";
        message.textContent = "No tasks found 💗";
        list.appendChild(message);
    }

    updateSummary();
    showSubjectCards();
}

function validateTask() {
    let name = document.getElementById("new-task-title").value.trim();
    let subject = document.getElementById("new-task-subject").value;
    let date = document.getElementById("new-task-date").value;

    document.getElementById("task-title-error").textContent = "";
    document.getElementById("task-subject-error").textContent = "";
    document.getElementById("task-date-error").textContent = "";

    let valid = true;

    if (name.length < 3) {
        document.getElementById("task-title-error").textContent =
            "Enter at least 3 characters.";
        valid = false;
    }

    if (subject === "") {
        document.getElementById("task-subject-error").textContent =
            "Please choose a subject.";
        valid = false;
    }

    if (date === "") {
        document.getElementById("task-date-error").textContent =
            "Please choose a deadline.";
        valid = false;
    } else {
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let selectedDate = new Date(date + "T00:00:00");

        if (selectedDate < today) {
            document.getElementById("task-date-error").textContent =
                "Deadline cannot be in the past.";
            valid = false;
        }
    }

    return valid;
}

function showMessage(message) {
    $("#task-feedback")
        .stop(true, true)
        .text(message)
        .hide()
        .fadeIn(300)
        .delay(2500)
        .fadeOut(500);
}

document.getElementById("add-task-form").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        if (validateTask() === false) {
            showMessage("Please fix the errors above.");
            return;
        }

        let name = document.getElementById("new-task-title").value.trim();
        let subject = document.getElementById("new-task-subject").value;
        let date = document.getElementById("new-task-date").value;

        let newTask = {
            name: name,
            subject: subject,
            date: date,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();

        document.getElementById("task-filter").value = "all";
        showTasks();

        document.getElementById("add-task-form").reset();

        $("#add-task-form").hide();
        $("#add-task-form").prop("hidden", true);

        showMessage("Task added successfully! 💗");
    }
);

document.getElementById("task-filter").addEventListener(
    "change",
    function() {
        showTasks();
    }
);

let focus = document.getElementById("daily-focus");

focus.value = localStorage.getItem("studyPlannerFocus") || "";

focus.addEventListener("input", function() {
    localStorage.setItem("studyPlannerFocus", focus.value);
});

let goals = document.querySelectorAll(".goal-item input");

for (let i = 0; i < goals.length; i++) {
    let goal = goals[i];
    let key = "studyGoal-" + goal.id;

    goal.checked = localStorage.getItem(key) === "true";

    goal.addEventListener("change", function() {
        localStorage.setItem(key, goal.checked);
    });
}

$("#show-task-form").on("click", function() {
    let form = $("#add-task-form");

    form.stop(true, true);

    if (form.prop("hidden")) {
        form.prop("hidden", false);
        form.hide().slideDown(300);
    } else {
        form.slideUp(300, function() {
            form.prop("hidden", true);
        });
    }
});

$(".goals-card input").on("change", function() {
    let goal = $(this).closest(".goal-item");
    let label = goal.find("label");

    label.fadeOut(150).fadeIn(150);
});

window.addEventListener("pageshow", function() {
    loadTasks();
    loadSubjects();
    showTasks();
});

loadTasks();
loadSubjects();
showTasks();
