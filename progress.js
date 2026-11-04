let subjects = [
    "Operating Systems",
    "WEB Technologies 1",
    "Software Design Patterns"
];


let tasks = [];

function loadTasks() {
    let savedTasks = localStorage.getItem("studyPlannerTasks");

    if (savedTasks !== null) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [
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
    }
}

function countCompleted() {
    let completed = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed === true) {
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
    let completed = countCompleted();
    let total = tasks.length;
    let percent = calculateProgress();

    document.getElementById("completed-count").textContent =
        completed + " / " + total;

    document.getElementById("overall-percent").textContent =
        percent + "%";
}


function showSubjectProgress() {
    let list = document.getElementById("subject-progress-list");

    list.innerHTML = "";

    for (let subject of subjects) {
        let total = 0;
        let completed = 0;

        for (let task of tasks) {
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

       
        let row = document.createElement("article");
        row.className = "subject-row";

        let heading = document.createElement("div");
        heading.className = "subject-heading";

        let title = document.createElement("h3");
        title.textContent = subject;

        let description = document.createElement("p");
        description.textContent =
            completed + " of " + total + " tasks completed";

        heading.appendChild(title);
        heading.appendChild(description);

        // Create progress bar
        let track = document.createElement("div");
        track.className = "progress-track";

        let bar = document.createElement("progress");
        bar.max = 100;
        bar.value = percent;
        bar.setAttribute("aria-label", subject + " progress");

        let number = document.createElement("span");
        number.textContent = percent + "%";

        track.appendChild(bar);
        track.appendChild(number);

        row.appendChild(heading);
        row.appendChild(track);

        list.appendChild(row);
    }
}

function showMotivation() {
    let percent = calculateProgress();
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
    let list = document.getElementById("completed-list");
    list.innerHTML = "";

    let completedCount = 0;

    for (let task of tasks) {
        if (task.completed === true) {
            completedCount++;

            let item = document.createElement("div");
            item.className = "completed-item";

            let name = document.createElement("strong");
            name.textContent = "✓ " + task.name;

            let subject = document.createElement("p");
            subject.textContent = task.subject;

            item.appendChild(name);
            item.appendChild(subject);

            list.appendChild(item);
        }
    }

    if (completedCount === 0) {
        list.textContent = "No completed tasks yet.";
    }
}


function updateProgress() {
    loadTasks();
    updateSummary();
    showSubjectProgress();
    showMotivation();
    showCompletedTasks();
}


document.getElementById("refresh-progress").addEventListener(
    "click",
    function() {
        updateProgress();

        $("#motivation-text")
            .stop(true, true)
            .hide()
            .fadeIn(400);
    }
);


$("#show-completed").on("click", function() {
    let list = $("#completed-list");

    if (list.prop("hidden")) {
        list.prop("hidden", false);
        list.hide().slideDown(300);
        $(this).text("Hide Completed Tasks");
    } else {
        list.slideUp(300, function() {
            list.prop("hidden", true);
        });

        $(this).text("Show Completed Tasks");
    }
});


updateProgress();
