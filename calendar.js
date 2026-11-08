
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
