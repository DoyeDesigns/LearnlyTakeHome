# LearnlyApp Assessment
A Task Management Dashboard for the AI product Teachmate (https://teachmateai.com/)

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Dependencies used](#dependencies-used)
- [Design thought process](#design-thought-process)
  - [Backend and Data](#backend-and-data)
  - [UI and Components](#ui-and-components)
  - [State Management](#state-management)
  - [Focus](#focus)

## Getting Started

### Installation
  
1. Clone the repository:

   ```
   git clone https://github.com/DoyeDesigns/LearnlyTakeHome.git
   ```

3. Move into the project directory:

   ```
   cd LearnlyTakeHome
   ```

4. Install dependencies:

   ```
   npm install
   ```

6. Start the development server:

   - Open a new terminal and type in the code below

    ```
    npm run dev
    ```

The frontend development server will run on `http://localhost:3000`.

## Dependencies used
- Firebase: For interacting with the Firebase cloud platform, specifically Firestore for your data.
- Shadcn- components: A UI library providing accessibility-focused components like checkbox, dialog, dropdown, etc.
- @tanstack/react-table: For building efficient and flexible data tables.
- @reduxjs/toolkit: A state management library with helpful tools for Redux usage.
- React and ReactDOM: The base React libraries for building user interfaces.
   
## Design thought Process

### Backend and Data
- Firebase: It provides a cloud-based real-time database with Firestore, making it easy to store and manage your task data in a scalable and readily accessible way. This avoids setting up and managing your own database server.

### UI and Components
- Schadcn: This library offers accessible and customizable React components like checkbox, dialog, dropdown, etc. It likely provided building blocks for your task interface elements like marking tasks complete, editing them, and displaying additional information via popups.

- @tanstack/react-table: This powerful library offers features like sorting, filtering, and pagination, making it ideal for efficiently displaying and managing large sets of tasks in a table format.

### State Management
- Reduxjs/toolkit: This toolkit simplifies state management in React applications. It likely helps manage changes to your task data, such as adding, editing, or marking tasks complete, and ensures consistent updates across the UI.

### Overall, I chose tools focused on:
- Scalability and ease of use: Firebase for efficient data storage and management.
- Accessible and customizable UI: Radix UI for building consistent and easy-to-use components.
- Flexible data visualization: React Table for efficient and organized task display.
- Clear and maintainable state management: Redux Toolkit for handling data changes seamlessly.
