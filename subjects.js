
const subjects = JSON.parse(localStorage.getItem("subjects")) || [
    { name: "Operating Systems", description: "Linux commands and shell scripts.", tasks: 5 },
    { name: "Web Technologies", description: "HTML, CSS and responsive web design.", tasks: 4 },
    { name: "Finance", description: "Financial statements and analysis.", tasks: 3 },
    { name: "Analytical Methods", description: "Probability and analytical methods.", tasks: 6 }
];

const grid = document.querySelector(".subjects-grid");
const form = document.querySelector(".subject-form");
const search = document.querySelector("#subject-search");

function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function showSubjects(keyword = "") {
    grid.innerHTML = "";

    subjects.forEach((subject, index) => {
        if (!subject.name.toLowerCase().includes(keyword.toLowerCase())) {
            return;
        }

        const column = document.createElement("div");
        column.className = "col-12 col-md-6";

        const card = document.createElement("article");
        card.className = "subject-card h-100";

        const title = document.createElement("h2");
        title.textContent = subject.name;

        const description = document.createElement("p");
        description.textContent = subject.description;

        const tasks = document.createElement("p");
        tasks.textContent = subject.tasks + " Tasks";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            subjects.splice(index, 1);
            saveSubjects();
            showSubjects(search ? search.value : "");
        });

        card.append(title, description, tasks, deleteButton);
        column.appendChild(card);
        grid.appendChild(column);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const description = form.querySelectorAll('input[type="text"]')[1].value.trim();
    const tasks = Number(form.querySelector('input[type="number"]').value);

    let error = form.querySelector(".form-error");

    if (!error) {
        error = document.createElement("p");
        error.className = "form-error";
        form.appendChild(error);
    }

    if (name.length < 3) {
        error.textContent = "Subject name must contain at least 3 characters.";
        return;
    }

    if (description.length < 5) {
        error.textContent = "Description must contain at least 5 characters.";
        return;
    }

    if (!Number.isInteger(tasks) || tasks < 0 || form.querySelector('input[type="number"]').value.trim() === "") {
        error.textContent = "Enter a valid number of tasks (0 or more).";
        return;
    }

    subjects.push({ name, description, tasks });
    saveSubjects();
    showSubjects(search ? search.value : "");

    error.textContent = "Subject added successfully!";
    form.reset();
});

if (search) {
    search.addEventListener("input", function() {
        showSubjects(search.value);
    });
}

showSubjects();
