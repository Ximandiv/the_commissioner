# ABOUT

Spanish web application that helps you organize your commissions in a 'to-do' task like-manner to keep track of what's being done with a friendly interface

# TECHNOLOGIES

## Frontend
- HTML
- CSS
- JavaScript ES6

## Backend
- C# .NET 8
- REST API
- Postgre SQL
- Entity Framework Core 8
- NodaTimezone Library
- Moq
- XUnit

# REQUIREMENTS

Before running the_commissioner locally, make sure you have the following installed:

- .NET SDK 8.0

- PostgreSQL 15+ (local or remote instance)

- Visual Studio Code (with Live Server extension) or Visual Studio Community 2022 (Any other editor is fine too)

- Git (for cloning the repository)

- Modern web browser (Chrome, Edge, or Firefox recommended)

# HOW TO USE

The application has a monolith-like architecture dividing the frontend and backend in the same repository as follows:
- front
- back

## First Step
First, you need to run the backend project. To do so, locate and get inside the 'back' folder. Once there, you will see two folders:
- TC_API
- TestingLab

The main backend program is currently in TC_API folder (future clean architecture planned for this). Using a folder-oriented architecture. To run the project, get inside TC_API folder and run the command 'dotnet run'.

Alternatively, if you have Visual Studio Community, find the .sln file, open it and run it using https

Great! You now have the backend project in port :7117

## Second Step
Enter the front folder, once inside, open the index.html file by right clicking it and 'open live server' in the case of Visual Studio Code. In any other editor, you would need to simply run the .html live server in order to open it.

Great! You now have the Frontend up and running. Code is already integrated with the backend so you should only worry about having the Backend REST API alive and running for the app to work.