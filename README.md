# POS System Backend - Spring Boot

This repository contains the backend service for a full-stack Point of Sale (POS) system. It is built using Spring Boot and provides a robust REST API for managing customers, items, and orders. It is designed to integrate seamlessly with a React frontend and utilizes MySQL for persistent data storage.

## Tech Stack
* **Framework:** Spring Boot 3.x
* **Language:** Java
* **Database:** MySQL
* **Data Access:** Spring Data JPA / Hibernate
* **Dependency Management:** Maven

## Project Architecture

This application follows a standard layered architecture:
* **Controller Layer:** Intercepts HTTP requests from the client (React), processes JSON payloads, and handles HTTP responses.
* **Service Layer:** Contains the core business logic and validations.
* **Repository Layer:** Interfaces with the MySQL database using Spring Data JPA for CRUD operations.
* **Entity Layer:** Represents the database tables as Java objects.

## Key Features
* RESTful API endpoints for Customer, Item, and Order management.
* Cross-Origin Resource Sharing (CORS) configured for frontend communication.
* Automated database schema generation via Hibernate.

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Ruvinda-Shaluka/POS-Springboot.git](https://github.com/Ruvinda-Shaluka/POS-Springboot.git)
   cd POS-Springboot/backend
