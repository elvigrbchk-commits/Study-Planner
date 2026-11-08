
const defaultTasks = [
    { name: "Complete Linux assignment", subject: "Operating Systems", date: "2026-11-10", completed: false },
    { name: "Create the Tasks page", subject: "WEB Technologies 1", date: "2026-11-12", completed: true },
    { name: "Review the Bridge pattern", subject: "Software Design Patterns", date: "2026-11-15", completed: false }
];

let currentDate = new Date();
let selectedDate = null;

function loadTasks() {
    try {
        const saved = localStorage.getItem("studyPlannerTasks");
        const tasks = saved === null ? defaultTasks : JSON.parse(saved);
        return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
        return [];
    }
}

function formatDate(year, month, day) {
    return year + "-" +
        String(month + 1).padStart(2, "0") + "-" +
        String(day).padStart(2, "0");
}

function showCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const tasks = loadTasks();

    document.getElementById("month-title").textContent =
        currentDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric"
        });

    const calendar = document.getElementById("calendar-days");
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (firstDay.getDay() + 6) % 7;

    let day = 1;

    for (let week = 0; week < 6; week++) {
        const row = document.createElement("tr");

        for (let column = 0; column < 7; column++) {
            const cell = document.createElement("td");

            if ((week > 0 || column >= startDay) && day <= daysInMonth) {
                const date = formatDate(year, month, day);
                const button = document.createElement("button");

                button.type = "button";
                button.className = "calendar-day";
                button.textContent = day;

                if (date === formatDate(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate()
                )) {
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

                const dayTasks = tasks.filter(task => task.date === date);

                for (const task of dayTasks) {
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

        if (day > daysInMonth) break;
    }
}

function showDayTasks(date) {
    const tasks = loadTasks().filter(task => task.date === date);
    const list = document.getElementById("day-tasks");

    document.getElementById("selected-date").textContent = date;
    list.innerHTML = "";

    if (tasks.length === 0) {
        list.textContent = "No tasks for this day 💗";
    } else {
        for (const task of tasks) {
            const item = document.createElement("p");
            item.textContent =
                (task.completed ? "✓ " : "○ ") +
                task.name + " — " + task.subject;
            list.appendChild(item);
        }
    }

    $("#day-tasks").hide().fadeIn(300);
}

document.getElementById("prev-month").addEventListener("click", function () {
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() - 1);
    selectedDate = null;
    showCalendar();
    $("#day-tasks").slideUp(200);
    document.getElementById("selected-date").textContent = "Select a date";
});

document.getElementById("next-month").addEventListener("click", function () {
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + 1);
    selectedDate = null;
    showCalendar();
    $("#day-tasks").slideUp(200);
    document.getElementById("selected-date").textContent = "Select a date";
});

window.addEventListener("pageshow", showCalendar);

showCalendar();

let weekDate = new Date();
let selectedWeekDay = null;

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

    const options = { month: "short", day: "numeric" };

    document.getElementById("week-title").textContent =
        monday.toLocaleDateString("en-US", options) +
        " - " +
        sunday.toLocaleDateString("en-US", options);

    const container = document.getElementById("week-days");
    container.innerHTML = "";

    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const tasks = loadTasks();

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const dateString = formatDate(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const button = document.createElement("button");
        button.type = "button";
        button.className = "week-day";

        const name = document.createElement("span");
        name.textContent = names[i];

        const number = document.createElement("strong");
        number.textContent = date.getDate();

        button.append(name, number);

        if (dateString === selectedWeekDay) {
            button.classList.add("selected");
        }

        if (tasks.some(task => task.date === dateString)) {
            const dot = document.createElement("span");
            dot.className = "task-dot";
            button.appendChild(dot);
        }

        button.addEventListener("click", function () {
            selectedWeekDay = dateString;
            showWeek();
        });

        container.appendChild(button);
    }

    showWeekTasks(monday, sunday);
}

function showWeekTasks(monday, sunday) {
    const container = document.getElementById("week-tasks");
    container.innerHTML = "";

    const tasks = loadTasks()
        .filter(task => {
            const date = task.date;

            const start = formatDate(
                monday.getFullYear(),
                monday.getMonth(),
                monday.getDate()
            );

            const end = formatDate(
                sunday.getFullYear(),
                sunday.getMonth(),
                sunday.getDate()
            );

            return date >= start && date <= end &&
                (!selectedWeekDay || date === selectedWeekDay);
        })
        .sort((a, b) => a.date.localeCompare(b.date));

    if (tasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-week";
        message.textContent = "No tasks for this period 💗";
        container.appendChild(message);
        return;
    }

    for (const task of tasks) {
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
    }
}

document.getElementById("prev-week").addEventListener("click", function () {
    weekDate.setDate(weekDate.getDate() - 7);
    selectedWeekDay = null;
    showWeek();
});

document.getElementById("next-week").addEventListener("click", function () {
    weekDate.setDate(weekDate.getDate() + 7);
    selectedWeekDay = null;
    showWeek();
});

window.addEventListener("pageshow", showWeek);

showWeek();
