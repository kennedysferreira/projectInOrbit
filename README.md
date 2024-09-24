
![Logo](https://imgur.com/LnEnpBx.png)



# In.Orbit

The project is a desktop goal-tracking website with weekly progress.

This repository contains two main parts of a fullstack project: a **Frontend** application based on React and a **Backend** API developed with Fastify. Each of these parts has its own environment and can be run separately.

## Index

- Frontend (Web)](#frontend-web) 
- [Technologies Used](#technologies-used-frontend) 
- [Installation](#installation-frontend) 
- [Commands Available](#commands-available-frontend) 
- [Backend](#backend) 
- [Technologies Used](#technologies-used-backend) 
- [Installation](#installation-backend) 
- [Commands Available](#commands-available-backend)
---

## Frontend (Web)

The frontend is an SPA application built using **React**, with **Vite** as a bundler and **Tailwind CSS** for styling.

### Technologies Used 

- **React**: ^18.3.1
- **Vite**: ^5.4.1
- **Tailwind CSS**: ^3.4.11
- **React Query** (Tanstack): ^5.56.2
- **Radix UI** (Componentes de Interface)
- **React Hook Form** (Formulários)
- **Zod** (Validação de Esquemas)
- **Dayjs** (Manipulação de Datas)

### Installation 

To run the frontend project, follow the steps below:

1. Install the dependencies: 
    ```bash 
    npm install

    ```

2. Run the development environment: 
    ```bash
     npm run dev

    ```

3. To generate the production build: 
    ```bash
     npm run build

    ```

## Backend

The backend API is built with Fastify and uses the Drizzle ORM for interactions with the database. It also uses Zod for data and schema validation.

### Technologies Used  
- Fastify: ^4.28.1 
- Drizzle ORM: ^0.33.0 
- Postgres: ^3.4.4 (Database driver)
- Zod: ^3.23.8 (Validation) 
- Fastify CORS: ^9.0.1 (CORS configuration) 
- Dayjs: ^1.11.13 (Date manipulation)

### Installation 

To run the frontend project, follow the steps below:

1. Install the dependencies: 
    ```bash
     npm install 
    ```

2. Run the development environment: 
    ```bash
     npm run dev

    ```

3. To generate the production build: 
    ```bash
     npm run seed

    ```

