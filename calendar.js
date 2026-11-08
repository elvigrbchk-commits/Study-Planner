
const defaultTasks = [
    { name: "Complete Linux assignment", subject: "Operating Systems", date: "2026-11-10", completed: false },
    { name: "Create the Tasks page", subject: "WEB Technologies 1", date: "2026-11-12", completed: true },
    { name: "Review the Bridge pattern", subject: "Software Design Patterns", date: "2026-11-15", completed: false }
];

let currentDate = new Date();
let weekDate = new Date();
let selectedDate = "";
let selectedWeekDay = "";
 function loadTasks() {
    const saved = localStorage.getItem("studyPlannerTasks");

    if (saved === null) {
        return defaultTasks;
    }

    return JSON.parse(saved);
}
 function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}
 function getTasksForDate(date) {
    const tasks = loadTasks();
    const result = [];

    for (const task of tasks) {
        if (task.date === date) {
            result.push(task);
        }
    }

    return result;
}
 function showCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const calendar = document.getElementById("calendar-days");

    document.getElementById("month-title").textContent =
        currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

    calendar.innerHTML = "";

    const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;

    while (day <= daysInMonth) {
        const row = document.createElement("tr");

        for (let i = 0; i < 7; i++) {
            const cell = document.createElement("td");

            if ((calendar.rows.length > 0 || i >= startDay) &&
                day <= daysInMonth) {

                const date = formatDate(new Date(year, month, day));
                const button = document.createElement("button");

                button.className = "calendar-day";
                button.textContent = day;

                if (date === formatDate(new Date())) {
                    button.classList.add("today");
                }

                if (date === selectedDate) {
                    button.classList.add("selected");
                }

                button.addEventListener("click", function () {
                    selectedDate = date;
                    showCalendar();
                    showDayTasks(date);
                });

                cell.appendChild(button);

                for (const task of getTasksForDate(date)) {
                    const label = document.createElement("p");
                    label.className = "calendar-task";
                    label.textContent = task.name;

                    if (task.completed) {
                        label.style.textDecoration = "line-through";
                    }

                    cell.appendChild(label);
                }

                day++;
            }

            row.appendChild(cell);
        }

        calendar.appendChild(row);
    }
}
 function showDayTasks(date) {
    const list = document.getElementById("day-tasks");
    const tasks = getTasksForDate(date);

    document.getElementById("selected-date").textContent = date;
    list.innerHTML = "";

    if (tasks.length === 0) {
        list.textContent = "No tasks for this day 💗";
    }

    for (const task of tasks) {
        const item = document.createElement("p");
        item.textContent =
            (task.completed ? "✓ " : "○ ") +
            task.name + " — " + task.subject;

        list.appendChild(item);
    }

    $("#day-tasks").hide().fadeIn(300);
}
 function changeMonth(number) {
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + number);

    selectedDate = "";
    showCalendar();

    document.getElementById("selected-date").textContent = "Select a date";
    $("#day-tasks").slideUp(200);
}

document.getElementById("prev-month").addEventListener("click", function () {
    changeMonth(-1);
});

document.getElementById("next-month").addEventListener("click", function () {
    changeMonth(1);
});
 function getMonday(date) {
    const monday = new Date(date);
    const day = (monday.getDay() + 6) % 7;

    monday.setDate(monday.getDate() - day);
    return monday;
}
 function showWeek() {
    const monday = getMonday(weekDate);
    const sunday = new Date(monday);

    sunday.setDate(monday.getDate() + 6);

    document.getElementById("week-title").textContent =
        monday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        }) + " - " +
        sunday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });

    const container = document.getElementById("week-days");
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    container.innerHTML = "";

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const dateText = formatDate(date);
        const button = document.createElement("button");

        button.className = "week-day";

        const name = document.createElement("span");
        name.textContent = names[i];

        const number = document.createElement("strong");
        number.textContent = date.getDate();

        button.append(name, number);

        if (dateText === selectedWeekDay) {
            button.classList.add("selected");
        }

        if (getTasksForDate(dateText).length > 0) {
            const dot = document.createElement("span");
            dot.className = "task-dot";
            button.appendChild(dot);
        }

        button.addEventListener("click", function () {
            selectedWeekDay = dateText;
            showWeek();
        });

        container.appendChild(button);
    }

    showWeekTasks(monday, sunday);
}
 function showWeekTasks(monday, sunday) {
    const container = document.getElementById("week-tasks");
    const tasks = loadTasks();

    const start = formatDate(monday);
    const end = formatDate(sunday);

    container.innerHTML = "";

    let count = 0;

    for (const task of tasks) {
        if (task.date < start || task.date > end) {
            continue;
        }

        if (selectedWeekDay !== "" && task.date !== selectedWeekDay) {
            continue;
        }

        const card = document.createElement("div");
        card.className = "week-task-card";

        const date = document.createElement("small");
        date.textContent = task.date;

        const title = document.createElement("strong");
        title.textContent = task.name;

        const subject = document.createElement("p");
        subject.textContent = task.subject;

        const status = document.createElement("span");
        status.textContent = task.completed
            ? "✓ Completed"
            : "○ Not completed";

        if (task.completed) {
            card.classList.add("completed");
        }

        card.append(date, title, subject, status);
        container.appendChild(card);

        count++;
    }

    if (count === 0) {
        container.innerHTML =
            '<p class="empty-week">No tasks for this period 💗</p>';
    }
}
 function changeWeek(number) {
    weekDate.setDate(weekDate.getDate() + number * 7);
    selectedWeekDay = "";
    showWeek();
}

document.getElementById("prev-week").addEventListener("click", function () {
    changeWeek(-1);
});

document.getElementById("next-week").addEventListener("click", function () {
    changeWeek(1);
});
 window.addEventListener("pageshow", function () {
    showCalendar();
    showWeek();
});

showCalendar();
showWeek();
