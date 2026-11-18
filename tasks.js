let subjects = [];

class Task {
    constructor(name, subject, date, completed) {
        this.name = name;
        this.subject = subject;
        this.date = date;
        this.completed = completed;
    }

    markCompleted() {
        this.completed = true;
    }

    updateTask(name, subject, date) {
        this.name = name;
        this.subject = subject;
        this.date = date;
    }
}

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
        try {
            let data = JSON.parse(saved);

            if (Array.isArray(data)) {
                let loadedTasks = [];

                for (let i = 0; i < data.length; i++) {
                    let item = data[i];

                    if (
                        item !== null &&
                        typeof item.name === "string" &&
                        typeof item.subject === "string" &&
                        typeof item.date === "string" &&
                        typeof item.completed === "boolean"
                    ) {
                        let task = new Task(
                            item.name,
                            item.subject,
                            item.date,
                            item.completed
                        );

                        loadedTasks.push(task);
                    }
                }

                tasks = loadedTasks;
            }
        } catch (error) {
            alert("Saved tasks could not be loaded.");
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
        try {
            let data = JSON.parse(saved);

            if (Array.isArray(data)) {
                let validSubjects = [];

                for (let i = 0; i < data.length; i++) {
                    if (
                        data[i] !== null &&
                        typeof data[i].name === "string"
                    ) {
                        validSubjects.push(data[i]);
                    }
                }

                subjectList = validSubjects;
            }
        } catch (error) {
            subjectList = [
                { name: "Operating Systems", description: "Linux commands and shell scripts." },
                { name: "Web Technologies", description: "HTML, CSS and responsive web design." },
                { name: "Finance", description: "Financial statements and analysis." },
                { name: "Analytical Methods", description: "Probability and analytical methods." }
            ];
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

    updateSubjectFilter();
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
    let subjectFilter = document.getElementById("subject-filter").value;

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

        if (subjectFilter !== "all" && task.subject !== subjectFilter) {
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
            if (checkbox.checked === true) {
                tasks[i].markCompleted();
            } else {
                tasks[i].completed = false;
            }

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
        let editButton = document.createElement("button");

        editButton.className = "edit-task";
        editButton.textContent = "Edit";
        editButton.type = "button";

        editButton.addEventListener("click", function() {
            let newName = prompt("Edit task name:", tasks[i].name);

            if (newName === null) {
                return;
            }

            newName = newName.trim();

            if (newName.length < 3) {
                alert("Task name must have at least 3 characters.");
                return;
            }

            let newSubject = prompt("Edit subject:", tasks[i].subject);

            if (newSubject === null) {
                return;
            }

            newSubject = newSubject.trim();

            if (newSubject === "") {
                alert("Subject cannot be empty.");
                return;
            }

            let newDate = prompt("Edit deadline (YYYY-MM-DD):", tasks[i].date);

            if (newDate === null) {
                return;
            }

            let selectedDate = new Date(newDate + "T00:00:00");
            let today = new Date();
            today.setHours(0, 0, 0, 0);

            if (
                newDate === "" ||
                isNaN(selectedDate.getTime()) ||
                selectedDate < today
            ) {
                alert("Enter a valid deadline that is not in the past.");
                return;
            }

            tasks[i].updateTask(newName, newSubject, newDate);

            if (!subjects.includes(newSubject)) {
                subjects.push(newSubject);
                updateSubjectFilter();
            }

            saveTasks();
            showTasks();
        });

        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            let answer = confirm("Are you sure you want to delete this task?");

            if (answer === true) {
                tasks.splice(i, 1);
                saveTasks();
                showTasks();
            }
        });

        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(editButton);
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

        let newTask = new Task(name, subject, date, false);

        tasks.push(newTask);
        saveTasks();

        document.getElementById("task-filter").value = "all";
        document.getElementById("subject-filter").value = "all";

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

document.getElementById("subject-filter").addEventListener(
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

function updateSubjectFilter() {
    let filter = document.getElementById("subject-filter");
    let currentValue = filter.value;

    filter.innerHTML = '<option value="all">All Subjects</option>';

    for (let i = 0; i < subjects.length; i++) {
        let option = document.createElement("option");
        option.value = subjects[i];
        option.textContent = subjects[i];
        filter.appendChild(option);
    }

    filter.value = currentValue;

    if (filter.value !== currentValue) {
        filter.value = "all";
    }
}
let goals = document.querySelectorAll(".goal-item input");

let customGoals = [];

let savedGoals = localStorage.getItem("customStudyGoals");

if (savedGoals !== null) {
    try {
        let data = JSON.parse(savedGoals);

        if (Array.isArray(data)) {
            customGoals = data;
        }
    } catch (error) {
        customGoals = [];
    }
}

function saveCustomGoals() {
    localStorage.setItem("customStudyGoals", JSON.stringify(customGoals));
}

function showCustomGoals() {
    let container = document.getElementById("custom-goals");
    container.innerHTML = "";

    for (let i = 0; i < customGoals.length; i++) {
        let goal = customGoals[i];

        let row = document.createElement("div");
        row.className = "custom-goal-item";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.completed;

        let label = document.createElement("span");
        label.textContent = goal.name;

        if (goal.completed === true) {
            label.style.textDecoration = "line-through";
        }

        checkbox.addEventListener("change", function() {
            customGoals[i].completed = checkbox.checked;
            saveCustomGoals();
            showCustomGoals();
        });

        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "edit-goal";

        editButton.addEventListener("click", function() {
            let newName = prompt("Edit your goal:", customGoals[i].name);

            if (newName === null) {
                return;
            }

            newName = newName.trim();

            if (newName.length < 3) {
                alert("Goal must have at least 3 characters.");
                return;
            }

            customGoals[i].name = newName;
            saveCustomGoals();
            showCustomGoals();
        });

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-goal";

        deleteButton.addEventListener("click", function() {
            if (confirm("Delete this goal?")) {
                customGoals.splice(i, 1);
                saveCustomGoals();
                showCustomGoals();
            }
        });

        row.appendChild(checkbox);
        row.appendChild(label);
        row.appendChild(editButton);
        row.appendChild(deleteButton);

        container.appendChild(row);
    }
}

document.getElementById("add-goal-btn").addEventListener("click", function() {
    let input = document.getElementById("new-goal");
    let error = document.getElementById("goal-error");
    let name = input.value.trim();

    error.textContent = "";

    if (name.length < 3) {
        error.textContent = "Enter at least 3 characters.";
        return;
    }

    let newGoal = {
        name: name,
        completed: false
    };

    customGoals.push(newGoal);
    saveCustomGoals();
    showCustomGoals();

    input.value = "";
});

showCustomGoals();

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

document.getElementById("book-search-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let topic = document.getElementById("book-search-input").value.trim();
    let status = document.getElementById("book-search-status");
    let results = document.getElementById("book-results");

    results.innerHTML = "";

    if (topic === "") {
        status.textContent = "Please enter a topic.";
        return;
    }

    status.textContent = "Loading books...";

    try {
        let response = await fetch(
            "https://openlibrary.org/search.json?q=" +
            encodeURIComponent(topic) + "&limit=6"
        );

        if (!response.ok) {
            throw new Error("Failed to load books.");
        }

        let data = await response.json();

        if (!Array.isArray(data.docs) || data.docs.length === 0) {
            status.textContent = "No books found. Try another topic.";
            return;
        }

        status.textContent = "Books found!";

        for (let i = 0; i < data.docs.length; i++) {
            let book = data.docs[i];

            let card = document.createElement("article");
            card.className = "book-card";

            let title = document.createElement("h3");
            title.textContent = book.title || "Unknown title";

            let author = document.createElement("p");

            if (book.author_name && book.author_name.length > 0) {
                author.textContent = "Author: " + book.author_name[0];
            } else {
                author.textContent = "Author unknown";
            }

            card.appendChild(title);
            card.appendChild(author);
            results.appendChild(card);
        }

    } catch (error) {
        status.textContent = "Could not load books. Please try again.";
    }
});

let bookSuggestions = document.querySelectorAll(".book-suggestion");

for (let i = 0; i < bookSuggestions.length; i++) {
    bookSuggestions[i].addEventListener("click", function() {
        let topic = bookSuggestions[i].getAttribute("data-topic");

        document.getElementById("book-search-input").value = topic;

        document.getElementById("book-search-form").requestSubmit();
    });
}