# Custom Event Calendar

A flexible and user-friendly custom event calendar built with React.

## Problems Solved

This project addresses the need for a customizable and intuitive event calendar that goes beyond the limitations of standard calendar applications. It provides a robust solution for:

* **Visualizing Events:** Displaying events clearly and efficiently on a calendar interface.
* **Managing Events:** Adding, editing, and deleting events with ease.
* **Customization:** Tailoring the calendar's appearance and functionality to specific needs.
* **Conflict Detection:** Identifying and resolving scheduling conflicts.
* **Recurring Events:** Handling events that repeat on a regular basis.

## Use Cases

This calendar application is suitable for a wide range of scenarios, including:

* **Personal Scheduling:** Managing appointments, deadlines, and personal events.
* **Team Collaboration:** Coordinating schedules and meetings for teams and organizations.
* **Project Management:** Visualizing project timelines and milestones.
* **Event Planning:** Organizing events, conferences, and workshops.
* **Resource Booking:** Scheduling the use of shared resources, such as meeting rooms or equipment.

## Challenges Faced

Developing this calendar application involved overcoming several technical challenges:

* **Complex Date Logic:** Accurately handling date calculations, including leap years and different time zones.
* **User Interface Design:** Creating an intuitive and user-friendly calendar interface.
* **State Management:** Efficiently managing the calendar's state, including events, date ranges, and user interactions.
* **Event Persistence:** Storing and retrieving event data (e.g., using local storage or a database).
* **Recurring Event Implementation:** Implementing the logic for handling complex recurring event patterns.
* **Conflict Detection Algorithms:** Developing efficient algorithms to detect and resolve event conflicts.

## Technologies Used

* **Frontend:** HTML, CSS, JavaScript, React
* **Date Handling:** date-fns library
* **Styling:** Styled Components (though not explicitly listed in your provided "Technologies Used", it's used in your code, so I've added it for completeness as it's a key library for your styling)
* **Drag-and-Drop:** React DnD (often used for drag-and-drop functionality in React, assuming it's used based on your `DayCell.jsx` code)
* **Testing:** @testing-library/react 

## Getting Started (Local Development)

To run this application on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Tharun9905/custom-event-calendar-webapp.git](https://github.com/Tharun9905/custom-event-calendar-webapp.git)
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd custom-event-calendar-webapp
    ```

3.  **Install dependencies:**
    This command will install all the necessary Node.js packages and libraries for the project.
    ```bash
    npm install
    ```
    (Alternatively, if you use Yarn: `yarn install`)

4.  **Start the development server:**
    This command will start the application in development mode. It will typically open in your default web browser at `http://localhost:3000`.
    ```bash
    npm start
    ```
    (Alternatively, if you use Yarn: `yarn start`)

The application should now be running locally in your browser.

## Demo Link

https://custom-event-calendar-we.netlify.app/

## Resulted Images

* ![WhatsApp Image 2025-05-22 at 19 01 31_92d0b20c](https://github.com/user-attachments/assets/806c3403-468e-43be-8dfc-ae6b521253e0)
* ![WhatsApp Image 2025-05-22 at 19 01 42_ee741d9b](https://github.com/user-attachments/assets/5d05e05b-9917-4643-9205-30dc95233d93)
