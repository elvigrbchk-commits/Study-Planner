
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

let subjects = [];
let tasks = [];

function loadTasks() {
    const saved = localStorage.getItem("studyPlannerTasks");

    if (saved === null) {
        tasks = defaultTasks;
    } else {
        tasks = JSON.parse(saved);
    }
}

function loadSubjects() {
    const saved = localStorage.getItem("subjects");
    let subjectList = defaultSubjects;

    if (saved !== null) {
        subjectList = JSON.parse(saved);
    }

    subjects = [];

    for (const subject of subjectList) {
        subjects.push(subject.name);
    }

    for (const task of tasks) {
        let found = false;

        for (const subject of subjects) {
            if (subject === task.subject) {
                found = true;
            }
        }

        if (found === false) {
            subjects.push(task.subject);
        }
    }
}

function countCompleted() {
    let completed = 0;

    for (const task of tasks) {
        if (task.completed === true) {
            completed++;
        }
    }

    return completed;
}

function calculateProgress() {
    if (tasks.length === 0) {
        return 0;
    }

    return Math.round(countCompleted() / tasks.length * 100);
}

function updateSummary() {
    const completed = countCompleted();
    const total = tasks.length;
    const percent = calculateProgress();

    document.getElementById("completed-count").textContent =
        completed + " / " + total;

    document.getElementById("overall-percent").textContent =
        percent + "%";
}

function showSubjectProgress() {
    const list = document.getElementById("subject-progress-list");
    list.innerHTML = "";

    for (const subject of subjects) {
        let total = 0;
        let completed = 0;

        for (const task of tasks) {
            if (task.subject === subject) {
                total++;

                if (task.completed === true) {
                    completed++;
                }
            }
        }

        let percent = 0;

        if (total > 0) {
            percent = Math.round(completed / total * 100);
        }

        const row = document.createElement("article");
        row.className = "subject-row";

        const heading = document.createElement("div");
        heading.className = "subject-heading";

        const title = document.createElement("h3");
        title.textContent = subject;

        const description = document.createElement("p");
        description.textContent =
            completed + " of " + total + " tasks completed";

        heading.append(title, description);

        const track = document.createElement("div");
        track.className = "progress-track";

        const bar = document.createElement("progress");
        bar.max = 100;
        bar.value = percent;
        bar.setAttribute("aria-label", subject + " progress");

        const number = document.createElement("span");
        number.textContent = percent + "%";

        track.append(bar, number);
        row.append(heading, track);
        list.appendChild(row);
    }
}

function showMotivation() {
    const percent = calculateProgress();
    let message = "";

    if (tasks.length === 0) {
        message = "Add your first task to start tracking progress! 💗";
    } else if (percent === 100) {
        message = "Amazing! All tasks are completed! 🎉";
    } else if (percent >= 70) {
        message = "Almost there! Keep it up! 💗";
    } else if (percent >= 40) {
        message = "Good progress! You can do it!";
    } else {
        message = "Every small step matters. Keep going! 🌸";
    }

    document.getElementById("motivation-text").textContent = message;
}

function showCompletedTasks() {
    const list = document.getElementById("completed-list");
    list.innerHTML = "";

    let completedCount = 0;

    for (const task of tasks) {
        if (task.completed === true) {
            completedCount++;

            const item = document.createElement("div");
            item.className = "completed-item";

            const name = document.createElement("strong");
            name.textContent = "✓ " + task.name;

            const subject = document.createElement("p");
            subject.textContent = task.subject;

            item.append(name, subject);
            list.appendChild(item);
        }
    }

    if (completedCount === 0) {
        list.textContent = "No completed tasks yet.";
    }
}

function updateProgress() {
    loadTasks();
    loadSubjects();
    updateSummary();
    showSubjectProgress();
    showMotivation();
    showCompletedTasks();
}

document.getElementById("refresh-progress").addEventListener("click", function () {
    updateProgress();

    $("#motivation-text").hide().fadeIn(400);
});

$("#show-completed").on("click", function () {
    const list = $("#completed-list");

    if (list.prop("hidden")) {
        list.prop("hidden", false);
        list.hide().slideDown(300);
        $(this).text("Hide Completed Tasks");
    } else {
        list.slideUp(300, function () {
            list.prop("hidden", true);
        });

        $(this).text("Show Completed Tasks");
    }
});

window.addEventListener("pageshow", updateProgress);

updateProgress();
