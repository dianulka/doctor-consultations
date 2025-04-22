# ``` DoctorConsultations```

A web application for managing medical consultations, built with Angular 18.2.12 and backed by Firebase. It allows patients to book appointments, doctors to manage their availability and absence, and admins to oversee the system.

## Features

-  **Authentication** via Firebase (registration and login)
-  **Three user roles**:
    - **Patient** – can browse doctor calendars and book available appointments
    - **Doctor** – can manage their personal calendar, add available times, and mark absences
    - **Admin** – can add new doctors to the system
-  **Calendar-based interface** for booking and managing availability
-  **Real-time data** synchronization with Firebase Firestore


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
