#Study Planner

##Project Description

Study Planner is a web-based application designed to help students organize their academic workload and personal schedules. It provides a convenient interface for managing tasks, subjects, study goals, and calendar events, allowing users to keep track of deadlines, plan activities, and monitor their academic progress.

The application combines academic planning with personal organization features through a dashboard, calendar, task management, subject management, goal tracking, and progress statistics.

###Team Members

* Elvira Grabchuk — Dashboard and Calendar
* Talshyn Otegen — Subjects, About Us, CSS
* Aruzhan Marat — Tasks and Progress

###Pages

1. Dashboard
2. Subjects
3. Tasks
4. Calendar
5. Progress
6. About Us
7. Contact Us

###Project Features

1. Dashboard

* Overview of the student’s study planner.
* Display of total, completed, pending, and overdue tasks.
* Overall study progress visualization.
* Progress bar showing task completion.
* Clickable statistic cards for quick navigation and filtering.
* Study goals and daily focus management.

2. Calendar

* Monthly calendar navigation.
* Weekly calendar view.
* Display of scheduled tasks, activities, and reminders.
* Day selection and viewing scheduled items.
* Add and manage calendar entries.
* Separate handling of tasks, activities, and reminders.

3. Task Management

* Create and manage academic tasks.
* Assign subjects and due dates.
* Add task descriptions.
* Track task completion status.
* Edit and delete tasks.
* Confirmation before deleting records.
* Form validation to prevent invalid input.

4. Subject Management

* Add new subjects.
* View existing subjects.
* Edit subject information.
* Delete subjects.
* Search subjects.
* Organize tasks according to subjects.

5. Goal Management

* Create personal and academic goals.
* Edit existing goals.
* Delete goals.
* Display and manage user-added goals.

6. Progress Tracking

* Track completed and pending tasks.
* Monitor overdue tasks.
* View overall completion progress.
* View progress by subject.
* Display statistics to help users evaluate their study workload.

###Final Project Features

1. API Integration — Open Library

* Integration with the Open Library API.
* Search for books by topic.
* Retrieve remote data using fetch().
* Use async/await for asynchronous requests.
* Process JSON responses.
* Dynamically display search results using DOM manipulation.
* Loading, success, empty-results, and error states.
* Handle network errors and unsuccessful requests.

2. Object-Oriented Programming (OOP)

* JavaScript classes for organizing application data and functionality.
* Task class for task-related operations.
* Subject class for subject-related operations.
* Constructors, properties, and methods.
* Create and use multiple objects.
* Organize related functionality and reduce code duplication.

3. Local Storage

* Save subjects and tasks.
* Save study goals and daily focus.
* Store structured data using JSON.
* Restore saved data when the website is reopened.
* Update stored data when records are modified.
* Maintain user data between browser sessions.
* Handle missing or invalid stored data.

4. CRUD Operations

Full CRUD functionality for managing application records:

* Create — add new subjects, tasks, and goals.
* Read — display saved records in the interface.
* Update — edit existing subjects, tasks, and goals.
* Delete — remove records with deletion confirmation.

5. Search and Filtering

* Search subjects.
* Filter tasks by completion status.
* Separate completed and pending tasks.
* Display relevant records based on selected filters.

6. Dashboard and Statistics

* Total tasks.
* Completed tasks.
* Pending tasks.
* Overdue tasks.
* Overall progress bar.
* Progress by subject.
* Interactive statistic cards.

7. Calendar and Planning

* Monthly and weekly calendar views.
* Calendar navigation.
* Daily schedule management.
* Tasks, activities, and reminders.
* Viewing items associated with selected dates.

8. Forms and Validation

* Input validation for forms.
* Required-field validation.
* Prevent invalid task and subject entries.
* Date validation where applicable.
* User feedback for invalid input.

9. Responsive Design and User Interface

* Responsive layouts for different screen sizes.
* Navigation between website pages.
* Interactive buttons and components.
* jQuery animations.
* Consistent styling across the application.

Technologies Used

* HTML5
* CSS3
* Bootstrap 5
* JavaScript
* jQuery
* DOM Manipulation
* Local Storage
* Fetch API
* JSON
* Asynchronous JavaScript (async/await)

##API Information

API: Open Library

Endpoint:

https://openlibrary.org/search.json

The Open Library API is used to search for books based on a topic or search query. The application retrieves information from the API, processes the JSON response, and displays relevant book results in the interface.

No API key is required.

API requests are handled asynchronously. The interface provides feedback during loading, when results are found, when no results are available, and when an error occurs.

##How to Run

1. Clone or download the repository:

git clone https://github.com/elvigrbchk-commits/Study-Planner.git

2. Open the project folder in Visual Studio Code.
3. Launch index.html using the Live Server extension.
4. Navigate between the website pages using the navigation bar.
5. Test the main features:
    * Add, edit, and delete subjects.
    * Add, edit, complete, and delete tasks.
    * Create and manage study goals.
    * Explore the calendar.
    * Check statistics and progress.
    * Search for books on the Tasks page.
    * Search subjects and filter tasks.
6. Refresh the website to test Local Storage and verify that previously saved data is restored.

###GitHub Repository

https://github.com/elvigrbchk-commits/Study-Planner

###Published Website

https://elvigrbchk-commits.github.io/Study-Planner/

##Project Structure

The project contains separate HTML, CSS, and JavaScript files for individual pages and features. Page-specific scripts handle functionality, while shared design elements maintain consistency throughout the website.

The code is organized to separate page structure, styling, data management, and interactive functionality.

##Purpose

The purpose of Study Planner is to provide students with a practical tool for managing academic responsibilities, organizing schedules, tracking assignments, setting study goals, and maintaining a structured approach to studying.
