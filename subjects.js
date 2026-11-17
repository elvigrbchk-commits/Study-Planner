
const defaultSubjects = [
    {
        name: "Operating Systems",
        description: "Linux commands and shell scripts."
    },
    {
        name: "Web Technologies",
        description: "HTML, CSS and responsive web design."
    },
    {
        name: "Finance",
        description: "Financial statements and analysis."
    },
    {
        name: "Analytical Methods",
        description: "Probability and analytical methods."
    }
];

class Subject {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    update(name, description) {
        this.name = name;
        this.description = description;
    }

    getProgress(tasks) {
        const related = tasks.filter(
            task => task.subject === this.name
        );

        const completed = related.filter(
            task => task.completed === true
        ).length;

        const total = related.length;

        const percent = total === 0
            ? 0
            : Math.round(completed / total * 100);

        return { total, completed, percent };
    }
}

function readArray(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        if (saved === null) {
            return fallback;
        }

        const data = JSON.parse(saved);

        return Array.isArray(data) ? data : fallback;
    } catch (error) {
        console.warn("Invalid saved data:", key);
        return fallback;
    }
}

function loadSubjects() {
    const data = readArray("subjects", defaultSubjects);

    return data
        .filter(item =>
            item &&
            typeof item.name === "string" &&
            item.name.trim() !== ""
        )
        .map(item => new Subject(
            item.name.trim(),
            typeof item.description === "string"
                ? item.description
                : ""
        ));
}

let subjects = loadSubjects();
let editingIndex = -1;

const grid = document.querySelector(".subjects-grid");
const form = document.querySelector(".subject-form");
const nameInput = document.getElementById("subject-name");
const descriptionInput = document.getElementById("subject-description");
const searchInput = document.getElementById("subject-search");
const feedback = document.getElementById("subject-feedback");

function saveSubjects() {
    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );
}

function getTasks() {
    return readArray("studyPlannerTasks", [])
        .filter(task =>
            task &&
            typeof task.subject === "string" &&
            typeof task.completed === "boolean"
        );
}

function showMessage(text) {
    feedback.textContent = text;
}

function showSubjects() {
    grid.innerHTML = "";

    const query = searchInput.value.trim().toLowerCase();
    const tasks = getTasks();

    let visible = 0;

    subjects.forEach(function(subject, index) {
        const text = (
            subject.name + " " + subject.description
        ).toLowerCase();

        if (!text.includes(query)) {
            return;
        }

        visible++;

        const stats = subject.getProgress(tasks);

        const column = document.createElement("div");
        column.className = "col-12 col-md-6";

        const card = document.createElement("article");
        card.className = "subject-card h-100";

        const header = document.createElement("div");
        header.className = "card-title";

        const title = document.createElement("h2");
        title.textContent = subject.name;

        const percent = document.createElement("span");
        percent.textContent = stats.percent + "%";

        header.append(title, percent);

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = subject.description;

        const count = document.createElement("p");
        count.textContent =
            stats.completed + " of " +
            stats.total + " tasks completed";

        const progress = document.createElement("div");
        progress.className = "progress";

        const bar = document.createElement("div");
        bar.className = "progress-bar";
        bar.style.width = stats.percent + "%";

        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-valuenow", stats.percent);
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.setAttribute(
            "aria-label",
            subject.name + " progress"
        );

        progress.appendChild(bar);

        const actions = document.createElement("div");
        actions.className = "subject-actions";

        const viewButton = document.createElement("a");
        viewButton.href = "tasks.html";
        viewButton.textContent = "View Tasks";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editingIndex = index;

            nameInput.value = subject.name;
            descriptionInput.value = subject.description;

            form.querySelector(
                'button[type="submit"]'
            ).textContent = "Save Changes";

            document.querySelector(".add-subject").open = true;

            nameInput.focus();

            showMessage("Editing " + subject.name);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            const answer = confirm(
                "Delete " + subject.name +
                "? Existing tasks will be kept."
            );

            if (answer === false) {
                return;
            }

            subjects.splice(index, 1);
            saveSubjects();

            if (editingIndex === index) {
                resetForm();
            } else if (editingIndex > index) {
                editingIndex--;
            }

            showSubjects();
            showMessage("Subject deleted successfully!");
        });

        actions.append(
            viewButton,
            editButton,
            deleteButton
        );

        card.append(
            header,
            description,
            count,
            progress,
            actions
        );

        column.appendChild(card);
        grid.appendChild(column);
    });

    document.getElementById("subjects-count").textContent =
        visible + " of " + subjects.length + " subjects";

    if (visible === 0) {
        const empty = document.createElement("p");
        empty.className = "col-12";
        empty.textContent = "No subjects found.";
        grid.appendChild(empty);
    }
}

function resetForm() {
    editingIndex = -1;
    form.reset();

    form.querySelector(
        'button[type="submit"]'
    ).textContent = "Add";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    const nameError = document.getElementById("name-error");
    const descriptionError =
        document.getElementById("description-error");

    nameError.textContent = "";
    descriptionError.textContent = "";

    if (name.length < 3) {
        nameError.textContent =
            "Enter at least 3 characters.";
        return;
    }

    if (description.length < 5) {
        descriptionError.textContent =
            "Enter at least 5 characters.";
        return;
    }

    const duplicate = subjects.some(function(subject, index) {
        return index !== editingIndex &&
            subject.name.toLowerCase() === name.toLowerCase();
    });

    if (duplicate) {
        nameError.textContent =
            "This subject already exists.";
        return;
    }

    const wasEditing = editingIndex !== -1;

    if (wasEditing) {
        const oldName = subjects[editingIndex].name;

        subjects[editingIndex].update(name, description);
        if (oldName !== name) {
            const tasks = readArray("studyPlannerTasks", null);

            if (tasks !== null) {
                tasks.forEach(function(task) {
                    if (task && task.subject === oldName) {
                        task.subject = name;
                    }
                });

                localStorage.setItem(
                    "studyPlannerTasks",
                    JSON.stringify(tasks)
                );
            }
        }
    } else {
        const newSubject = new Subject(name, description);
        subjects.push(newSubject);
    }

    saveSubjects();
    resetForm();

    document.querySelector(".add-subject").open = false;

    showSubjects();

    showMessage(
        wasEditing
            ? "Subject updated successfully!"
            : "Subject added successfully!"
    );
});

searchInput.addEventListener("input", showSubjects);
window.addEventListener("pageshow", function() {
    subjects = loadSubjects();
    showSubjects();
});

showSubjects();
