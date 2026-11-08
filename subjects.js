
const defaultSubjects = [
    { name: "Operating Systems", description: "Linux commands and shell scripts.", tasks: 5 },
    { name: "Web Technologies", description: "HTML, CSS and responsive web design.", tasks: 4 },
    { name: "Finance", description: "Financial statements and analysis.", tasks: 3 },
    { name: "Analytical Methods", description: "Probability and analytical methods.", tasks: 6 }
];

let subjects = defaultSubjects;

const saved = localStorage.getItem("subjects");

if (saved !== null) {
    subjects = JSON.parse(saved);
}

const grid = document.querySelector(".subjects-grid");
const form = document.querySelector(".subject-form");

function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function countTasks(subjectName) {
    const savedTasks = localStorage.getItem("studyPlannerTasks");
    let tasks = [];

    if (savedTasks !== null) {
        tasks = JSON.parse(savedTasks);
    }

    let count = 0;

    for (const task of tasks) {
        if (task.subject === subjectName) {
            count++;
        }
    }

    return count;
}

function showSubjects() {
    grid.innerHTML = "";

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];

        const column = document.createElement("div");
        column.className = "col-12 col-md-6";

        const card = document.createElement("article");
        card.className = "subject-card h-100";

        const title = document.createElement("h2");
        title.textContent = subject.name;

        const description = document.createElement("p");
        description.textContent = subject.description;

        const number = document.createElement("p");
        number.textContent = countTasks(subject.name) + " Tasks";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            subjects.splice(i, 1);
            saveSubjects();
            showSubjects();
        });

        card.append(title, description, number, deleteButton);
        column.appendChild(card);
        grid.appendChild(column);
    }
}

function validateSubject() {
    const name = document.getElementById("subject-name").value.trim();
    const description = document.getElementById("subject-description").value.trim();
    const tasksInput = document.getElementById("subject-tasks").value;

    const nameError = document.getElementById("name-error");
    const descriptionError = document.getElementById("description-error");
    const tasksError = document.getElementById("tasks-error");

    nameError.textContent = "";
    descriptionError.textContent = "";
    tasksError.textContent = "";

    let valid = true;

    if (name.length < 3) {
        nameError.textContent = "Enter at least 3 characters.";
        valid = false;
    }

    if (description.length < 5) {
        descriptionError.textContent = "Enter at least 5 characters.";
        valid = false;
    }

    if (tasksInput === "" || Number(tasksInput) < 0 ||
        !Number.isInteger(Number(tasksInput))) {
        tasksError.textContent = "Enter a valid number of tasks.";
        valid = false;
    }

    return valid;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateSubject() === false) {
        return;
    }

    const name = document.getElementById("subject-name").value.trim();
    const description = document.getElementById("subject-description").value.trim();
    const tasks = Number(document.getElementById("subject-tasks").value);

    subjects.push({
        name: name,
        description: description,
        tasks: tasks
    });

    saveSubjects();
    showSubjects();
    form.reset();

    let message = form.querySelector(".form-success");

    if (message === null) {
        message = document.createElement("p");
        message.className = "form-success";
        form.appendChild(message);
    }

    message.textContent = "Subject added successfully!";
});

window.addEventListener("pageshow", showSubjects);

showSubjects();
