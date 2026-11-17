const defaultTasks = [
    { name: "Complete Linux assignment", subject: "Operating Systems", date: "2026-11-10", completed: false },
    { name: "Create the Tasks page", subject: "WEB Technologies 1", date: "2026-11-12", completed: true },
    { name: "Review the Bridge pattern", subject: "Software Design Patterns", date: "2026-11-15", completed: false }
];

const defaultSubjects = [
    { name: "Operating Systems", description: "Linux commands and shell scripts." },
    { name: "Web Technologies", description: "HTML, CSS and responsive web design." },
    { name: "Finance", description: "Financial statements and analysis." },
    { name: "Analytical Methods", description: "Probability and analytical methods." }
];

let currentDate = new Date();
let weekDate = new Date();
let selectedDate = "";
let selectedWeekDay = "";
let editingEntry = null;

const addEntryBtn = document.getElementById("add-entry-btn");
const entryModal = document.getElementById("entry-modal");
const entryType = document.getElementById("entry-type");
const entryFields = document.getElementById("entry-fields");
const entryForm = document.getElementById("entry-form");

const monthViewBtn = document.getElementById("month-view-btn");
const weekViewBtn = document.getElementById("week-view-btn");
const monthCalendar = document.querySelector(".calendar-box");
const weeklyCalendar = document.querySelector(".weekly-calendar");
const monthNavigation = document.getElementById("month-navigation");
const weeklyHeader = document.getElementById("weekly-header");

function readArray(key, fallback = []) {
    try {
        const saved = localStorage.getItem(key);

        if (saved === null) {
            return fallback;
        }

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        console.warn("Could not read saved data:", key, error);
        return fallback;
    }
}

function loadTasks() {
    return readArray("studyPlannerTasks", [...defaultTasks]);
}

function loadSubjectsForCalendar() {
    const subjects = readArray("subjects", null);

    if (subjects === null) {
        return [...defaultSubjects];
    }

    return subjects.filter(subject =>
        subject &&
        typeof subject.name === "string" &&
        subject.name.trim() !== ""
    );
}

function saveTasks(tasks) {
    localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
}

function saveSubjects(subjects) {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function loadCalendarEntries() {
    return readArray("studyPlannerCalendarEntries", []);
}

function saveCalendarEntries(entries) {
    localStorage.setItem(
        "studyPlannerCalendarEntries",
        JSON.stringify(entries)
    );
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function getTasksForDate(date) {
    return loadTasks().filter(task => task && task.date === date);
}

function getCalendarEntriesForDate(date) {
    return loadCalendarEntries().filter(entry => entry && entry.date === date);
}

function showCalendar() {
    const calendar = document.getElementById("calendar-days");

    if (!calendar) {
        return;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthTitle = document.getElementById("month-title");

    if (monthTitle) {
        monthTitle.textContent = currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    }

    calendar.innerHTML = "";

    const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;

    while (day <= daysInMonth) {
        const row = document.createElement("tr");

        for (let i = 0; i < 7; i++) {
            const cell = document.createElement("td");

            if ((calendar.rows.length > 0 || i >= startDay) && day <= daysInMonth) {
                const date = formatDate(new Date(year, month, day));
                const button = document.createElement("button");

                button.type = "button";
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
                    selectedWeekDay = date;
                    showCalendar();
                    showDayTasks(date);
                });

                cell.appendChild(button);

                getTasksForDate(date).forEach(task => {
                    const label = document.createElement("p");
                    label.className = "calendar-task calendar-task--task";
                    label.textContent = task.name || "Untitled task";

                    if (task.completed) {
                        label.classList.add("completed");
                    }

                    cell.appendChild(label);
                });

                getCalendarEntriesForDate(date).forEach(entry => {
                    const label = document.createElement("p");
                    label.className = "calendar-task calendar-task--" + entry.type;
                    label.textContent = entry.title || "Untitled entry";

                    cell.appendChild(label);
                });

                day++;
            }

            row.appendChild(cell);
        }

        calendar.appendChild(row);
    }
}

function addEntryActions(item, type, id) {
    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editEntry(type, id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteEntry(type, id));

    actions.append(editButton, deleteButton);
    item.appendChild(actions);
}

function showDayTasks(date) {
    const list = document.getElementById("day-tasks");
    const selectedDateTitle = document.getElementById("selected-date");

    if (!list || !selectedDateTitle) {
        return;
    }

    const tasks = loadTasks();
    const entries = loadCalendarEntries();

    const taskIndexes = [];

    tasks.forEach((task, index) => {
        if (task && task.date === date) {
            taskIndexes.push(index);
        }
    });

    const dayEntries = entries.filter(
        entry => entry && entry.date === date
    );

    selectedDateTitle.textContent = formatDisplayDate(date);
    list.innerHTML = "";

    if (taskIndexes.length === 0 && dayEntries.length === 0) {
        list.textContent = "Your plans for this day will appear here.";
        return;
    }

    taskIndexes.forEach(index => {
        const task = tasks[index];
        const item = document.createElement("div");
        item.className = "day-entry day-entry--task";

        const typeLabel = document.createElement("h4");
        typeLabel.className = "day-entry-type";
        typeLabel.textContent = "Task";

        const text = document.createElement("p");
        text.textContent =
            (task.completed ? "✓ " : "○ ") +
            (task.name || "Untitled task") +
            " — " + (task.subject || "");

        item.append(typeLabel, text);

        addEntryActions(item, "task", index);
        list.appendChild(item);
    });

    dayEntries.forEach(entry => {
        const item = document.createElement("div");
        item.className = "day-entry day-entry--" + entry.type;

        const typeLabel = document.createElement("h4");
        typeLabel.className = "day-entry-type";

        typeLabel.textContent =
            entry.type.charAt(0).toUpperCase() +
            entry.type.slice(1);

        const text = document.createElement("p");
        let details = entry.title || "";

        if (entry.type === "activity") {
            details += " — " +
                (entry.startTime || "") +
                " to " +
                (entry.endTime || "");
        } else if (entry.type === "reminder") {
            details += " — " + (entry.time || "");
        }

        text.textContent = details;

        item.append(typeLabel, text);

        addEntryActions(item, entry.type, entry.id);
        list.appendChild(item);
    });
}

function openEntryModal() {
    const dateToUse = selectedDate || selectedWeekDay;

    if (!dateToUse) {
        alert("Please select a date first.");
        return;
    }

    selectedDate = dateToUse;
    editingEntry = null;
    entryForm.reset();
    entryModal.hidden = false;
    entryType.value = "";
    entryFields.innerHTML = "";

    document.getElementById("entry-modal-title").textContent = "Add new entry";
}

function closeEntryModal() {
    entryModal.hidden = true;
    entryForm.reset();
    entryFields.innerHTML = "";
    editingEntry = null;

    document.getElementById("entry-modal-title").textContent = "Add new entry";
}

function createField(labelText, name, type = "text", required = true) {
    const wrapper = document.createElement("div");
    wrapper.className = "entry-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = name;

    const input = document.createElement("input");
    input.type = type;
    input.id = name;
    input.name = name;
    input.required = required;

    if (type === "date") {
        input.value = selectedDate || selectedWeekDay || formatDate(new Date());
    }

    wrapper.append(label, input);
    return wrapper;
}

function createTextarea(labelText, name, required = false) {
    const wrapper = document.createElement("div");
    wrapper.className = "entry-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = name;

    const textarea = document.createElement("textarea");
    textarea.id = name;
    textarea.name = name;
    textarea.required = required;

    wrapper.append(label, textarea);
    return wrapper;
}

function createSubjectSelect() {
    const wrapper = document.createElement("div");
    wrapper.className = "entry-field subject-select-wrapper";

    const label = document.createElement("label");
    label.textContent = "Subject";
    label.htmlFor = "subject";

    const select = document.createElement("select");
    select.id = "subject";
    select.name = "subject";
    select.required = true;

    const subjects = loadSubjectsForCalendar();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select subject";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject.name;
        option.textContent = subject.name;
        select.appendChild(option);
    });

    const newOption = document.createElement("option");
    newOption.value = "__new__";
    newOption.textContent = "+ Add new subject";
    select.appendChild(newOption);

    wrapper.append(label, select);

    select.addEventListener("change", function () {
        const existingFields = wrapper.querySelector(".new-subject-fields");

        if (existingFields) {
            existingFields.remove();
        }

        if (select.value === "__new__") {
            const fields = document.createElement("div");
            fields.className = "new-subject-fields";

            const heading = document.createElement("h4");
            heading.textContent = "New subject";

            const nameField = createField(
                "New subject name",
                "newSubjectName"
            );

            const descriptionField = createTextarea(
                "Subject description",
                "newSubjectDescription"
            );

            fields.append(heading, nameField, descriptionField);
            wrapper.appendChild(fields);
        }
    });

    return wrapper;
}

function showEntryFields(type) {
    entryFields.innerHTML = "";

    if (type === "task") {
        entryFields.append(
            createField("Task name", "name"),
            createSubjectSelect(),
            createField("Date", "date", "date"),
            createTextarea("Description", "description")
        );
    } else if (type === "activity") {
        entryFields.append(
            createField("Activity title", "title"),
            createField("Date", "date", "date"),
            createField("Start time", "startTime", "time"),
            createField("End time", "endTime", "time"),
            createTextarea("Description", "description")
        );
    } else if (type === "reminder") {
        entryFields.append(
            createField("Reminder title", "title"),
            createField("Date", "date", "date"),
            createField("Time", "time", "time"),
            createTextarea("Note", "note")
        );
    }
}

function editEntry(type, id) {
    editingEntry = { type, id };

    entryModal.hidden = false;
    entryType.value = type;
    showEntryFields(type);

    let entry;

    if (type === "task") {
        entry = loadTasks()[id];
    } else {
        entry = loadCalendarEntries().find(item => item.id === id);
    }

    if (!entry) {
        closeEntryModal();
        return;
    }

    entryFields.querySelectorAll("input, textarea").forEach(field => {
        if (entry[field.name] !== undefined) {
            field.value = entry[field.name];
        }
    });

    if (type === "task") {
        const subjectSelect = entryFields.querySelector('select[name="subject"]');

        const subjectExists = Array.from(subjectSelect.options)
            .some(option => option.value === entry.subject);

        if (!subjectExists && entry.subject) {
            const option = document.createElement("option");
            option.value = entry.subject;
            option.textContent = entry.subject;
            subjectSelect.insertBefore(option, subjectSelect.lastElementChild);
        }

        subjectSelect.value = entry.subject || "";
    }

    document.getElementById("entry-modal-title").textContent = "Edit entry";
}

function deleteEntry(type, id) {
    if (!confirm("Are you sure you want to delete this entry?")) {
        return;
    }

    if (type === "task") {
        const tasks = loadTasks();
        tasks.splice(id, 1);
        saveTasks(tasks);
    } else {
        const entries = loadCalendarEntries().filter(entry => entry.id !== id);
        saveCalendarEntries(entries);
    }

    showCalendar();

    if (selectedDate) {
        showDayTasks(selectedDate);
    }

    showWeek();
}

function changeMonth(number) {
    currentDate.setDate(1);
    currentDate.setMonth(currentDate.getMonth() + number);

    selectedDate = "";
    selectedWeekDay = "";

    showCalendar();

    document.getElementById("selected-date").textContent = "Select a date";
    document.getElementById("day-tasks").textContent =
        "Click a date to see tasks.";
}

document.getElementById("prev-month").addEventListener("click", () => {
    changeMonth(-1);
});

document.getElementById("next-month").addEventListener("click", () => {
    changeMonth(1);
});

function getMonday(date) {
    const monday = new Date(date);
    const day = (monday.getDay() + 6) % 7;

    monday.setDate(monday.getDate() - day);
    monday.setHours(0, 0, 0, 0);

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

        button.type = "button";
        button.className = "week-day";

        const name = document.createElement("span");
        name.textContent = names[i];

        const number = document.createElement("strong");
        number.textContent = date.getDate();

        button.append(name, number);

        if (dateText === selectedWeekDay) {
            button.classList.add("selected");
        }

        const tasks = getTasksForDate(dateText);
        const entries = getCalendarEntriesForDate(dateText);
        const types = [];

        if (tasks.length > 0) {
            types.push("task");
        }

        if (entries.some(entry => entry.type === "activity")) {
            types.push("activity");
        }

        if (entries.some(entry => entry.type === "reminder")) {
            types.push("reminder");
        }

        const dots = document.createElement("div");
        dots.className = "week-day-dots";

        types.forEach(type => {
            const dot = document.createElement("span");
            dot.className = "week-day-dot week-day-dot--" + type;
            dots.appendChild(dot);
        });

        button.appendChild(dots);

        button.addEventListener("click", function () {
            selectedWeekDay = dateText;
            selectedDate = dateText;
            showWeek();
            showDayTasks(dateText);
        });

        container.appendChild(button);
    }

    showWeekTasks(monday, sunday);
}

function showWeekTasks(monday, sunday) {
    const container = document.getElementById("week-tasks");
    const start = formatDate(monday);
    const end = formatDate(sunday);

    container.innerHTML = "";

    const weekTasks = loadTasks()
        .map((task, index) => ({
            ...task,
            type: "task",
            id: index
        }))
        .filter(task =>
            task.date >= start &&
            task.date <= end &&
            (selectedWeekDay === "" || task.date === selectedWeekDay)
        );

    const weekEntries = loadCalendarEntries().filter(entry =>
        entry.date >= start &&
        entry.date <= end &&
        (selectedWeekDay === "" || entry.date === selectedWeekDay)
    );

    const allPlans = [...weekTasks, ...weekEntries];

    allPlans.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);

        if (dateCompare !== 0) {
            return dateCompare;
        }

        const timeA = a.startTime || a.time || "";
        const timeB = b.startTime || b.time || "";

        return timeA.localeCompare(timeB);
    });

    if (allPlans.length === 0) {
        container.textContent = "No plans for this period.";
        return;
    }

    allPlans.forEach(plan => {
        const card = document.createElement("div");
        card.className = "week-task-card week-task-card--" + plan.type;

        const dateRow = document.createElement("div");
        dateRow.className = "week-task-date-row";

        const date = document.createElement("small");
        date.className = "week-task-date week-task-date--" + plan.type;
        date.textContent = formatDisplayDate(plan.date);

        const typeLabel = document.createElement("span");
        typeLabel.className =
            "week-task-type week-task-type--" + plan.type;
        typeLabel.textContent =
            plan.type.charAt(0).toUpperCase() + plan.type.slice(1);

        dateRow.append(date, typeLabel);

        const title = document.createElement("strong");
        const details = document.createElement("p");
        const status = document.createElement("span");

        if (plan.type === "task") {
            title.textContent = plan.name || "Untitled task";
            details.textContent = plan.subject || "";
            status.textContent = plan.completed
                ? "✓ Completed"
                : "○ Not completed";

            if (plan.completed) {
                card.classList.add("completed");
            }
        } else if (plan.type === "activity") {
            title.textContent = plan.title || "Untitled activity";
            details.textContent =
                (plan.startTime || "") + " - " + (plan.endTime || "");
            status.textContent = plan.description || "Activity";
        } else if (plan.type === "reminder") {
            title.textContent = plan.title || "Untitled reminder";
            details.textContent = plan.time || "";
            status.textContent = plan.note || "Reminder";
        }

        const actions = document.createElement("div");
        actions.className = "entry-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            editEntry(plan.type, plan.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteEntry(plan.type, plan.id);
        });

        actions.append(editButton, deleteButton);
        card.append(dateRow, title, details, status, actions);
        container.appendChild(card);
    });
}

function changeWeek(number) {
    weekDate.setDate(weekDate.getDate() + number * 7);
    selectedWeekDay = "";
    selectedDate = "";
    showWeek();
}

document.getElementById("prev-week").addEventListener("click", () => {
    changeWeek(-1);
});

document.getElementById("next-week").addEventListener("click", () => {
    changeWeek(1);
});

function switchCalendarView(view) {
    const isMonth = view === "month";

    monthCalendar.hidden = !isMonth;
    monthNavigation.hidden = !isMonth;
    weeklyCalendar.hidden = isMonth;
    weeklyHeader.hidden = isMonth;

    monthViewBtn.classList.toggle("active", isMonth);
    weekViewBtn.classList.toggle("active", !isMonth);

    if (isMonth) {
        showCalendar();
    } else {
        showWeek();
    }
}

monthViewBtn.addEventListener("click", () => {
    switchCalendarView("month");
});

weekViewBtn.addEventListener("click", () => {
    switchCalendarView("week");
});

addEntryBtn.addEventListener("click", openEntryModal);

document.getElementById("close-entry-modal")
    .addEventListener("click", closeEntryModal);

document.getElementById("cancel-entry-btn")
    .addEventListener("click", closeEntryModal);

entryType.addEventListener("change", function () {
    showEntryFields(this.value);
});

entryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const type = entryType.value;
    const formData = new FormData(entryForm);
    const date = formData.get("date");

    if (!type) {
        alert("Please select an entry type.");
        return;
    }

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (type === "task") {
        const tasks = loadTasks();
        const subjectSelect = entryFields.querySelector("#subject");

        if (!subjectSelect) {
            alert("Please select a subject.");
            return;
        }

        let subjectName = subjectSelect.value;

        if (subjectName === "__new__") {
            const newNameInput = entryFields.querySelector(
                '[name="newSubjectName"]'
            );
            const newDescriptionInput = entryFields.querySelector(
                '[name="newSubjectDescription"]'
            );

            const newName = newNameInput ? newNameInput.value.trim() : "";
            const newDescription = newDescriptionInput
                ? newDescriptionInput.value.trim()
                : "";

            if (newName.length < 3 || newDescription.length < 5) {
                alert("Enter a valid subject name and description.");
                return;
            }

            const subjects = loadSubjectsForCalendar();

            const duplicate = subjects.some(subject =>
                subject.name.toLowerCase() === newName.toLowerCase()
            );

            if (duplicate) {
                alert("This subject already exists.");
                return;
            }

            subjects.push({
                name: newName,
                description: newDescription
            });

            saveSubjects(subjects);
            subjectName = newName;
        }

        if (!subjectName) {
            alert("Please select a subject.");
            return;
        }

        const taskName = (formData.get("name") || "").trim();

        if (!taskName) {
            alert("Please enter a task name.");
            return;
        }

        const taskData = {
            name: taskName,
            subject: subjectName,
            date: date,
            description: (formData.get("description") || "").trim(),
            completed: false
        };

        if (editingEntry && editingEntry.type === "task") {
            const existingTask = tasks[editingEntry.id];

            if (!existingTask) {
                return;
            }

            taskData.completed = existingTask.completed;
            tasks[editingEntry.id] = taskData;
        } else {
            tasks.push(taskData);
        }

        saveTasks(tasks);
    } else if (type === "activity" || type === "reminder") {
        const entries = loadCalendarEntries();

        const entryData = {
            id: editingEntry ? editingEntry.id : Date.now(),
            type: type,
            date: date
        };

        if (type === "activity") {
            entryData.title = (formData.get("title") || "").trim();
            entryData.startTime = formData.get("startTime");
            entryData.endTime = formData.get("endTime");
            entryData.description =
                (formData.get("description") || "").trim();

            if (!entryData.title || !entryData.startTime || !entryData.endTime) {
                alert("Please complete the activity title and times.");
                return;
            }

            if (entryData.endTime <= entryData.startTime) {
                alert("The activity end time must be later than the start time.");
                return;
            }
        }

        if (type === "reminder") {
            entryData.title = (formData.get("title") || "").trim();
            entryData.time = formData.get("time");
            entryData.note = (formData.get("note") || "").trim();

            if (!entryData.title || !entryData.time) {
                alert("Please complete the reminder title and time.");
                return;
            }
        }

        if (editingEntry) {
            const index = entries.findIndex(
                entry => entry.id === editingEntry.id
            );

            if (index === -1) {
                return;
            }

            entries[index] = entryData;
        } else {
            entries.push(entryData);
        }

        saveCalendarEntries(entries);
    }

    selectedDate = date;
    selectedWeekDay = date;

    showCalendar();
    showDayTasks(date);
    showWeek();
    closeEntryModal();
});

window.addEventListener("pageshow", function () {
    showCalendar();
    showWeek();

    if (selectedDate) {
        showDayTasks(selectedDate);
    }
});

showCalendar();
showWeek();
switchCalendarView("month");