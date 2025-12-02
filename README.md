# Members Only

A full-stack web application demonstrating authentication, authorization, and role-based access control. Built as part of The Odin Project's Node.js curriculum.

**Live Demo:** https://members-only-dl8l.onrender.com/

## Overview

Members Only is an exclusive message board where users can post anonymous messages. Members can see who wrote each message and when, while non-members only see the content. Administrators have additional privileges to moderate content.

## Database Design

![dbDesign](./Members_Only.drawio.png)

## What I Learned

### Authentication & Authorization
- Implementing user authentication with Passport.js and Local Strategy
- Session management using express-session with PostgreSQL store
- Password hashing and verification with bcrypt
- Role-based access control (Admin, Member, Non-Member)
- Protecting routes with authentication middleware

### Database Management
- Designing normalized PostgreSQL schemas with foreign key relationships
- Writing parameterized queries to prevent SQL injection
- Connection pooling with node-postgres (pg)
- Database migrations and seeding scripts

### Backend Development
- Building RESTful APIs with Express.js
- Form validation using Valibot schema validation
- Error handling patterns with custom error classes
- MVC architecture for code organization
- TypeScript for type safety

### Security Practices
- Environment variable management with dotenv
- Secure session configuration
- Password validation rules
- User input sanitization and validation

## Technologies Used

- **Runtime:** Bun
- **Framework:** Express.js 5
- **Database:** PostgreSQL with pg driver
- **Authentication:** Passport.js with passport-local strategy
- **Session Store:** connect-pg-simple
- **Validation:** Valibot
- **Template Engine:** EJS
- **Language:** TypeScript
- **Security:** bcrypt for password hashing

## Installation

Install dependencies:
```bash
bun install
```

Set up environment variables in `.env`:
```bash
DB_URL=postgresql://username:password@localhost:5432/members_only
COOKIE_SECRET=your_session_secret
MEMBER_CODE=your_membership_code
ADMIN_PASS=your_admin_password
```

Populate the database:
```bash
bun run populate
```

## Deployment with Docker

To deploy the application using Docker, follow these steps:

1.  **Ensure Docker Network exists:**
    If you don't have a `web_net` Docker network, create it:
    ```bash
    docker network create web_net
    ```

2.  **Add PostgreSQL service to your `docker-compose.yml`:**
    Make sure your `docker-compose.yml` includes the PostgreSQL service. Here's an example you can add to your existing `docker-compose.yml`:

    ```yaml
services:
  postgres:
    image: postgres:16-bookworm
    container_name: main_db
    restart: unless-stopped
    command: postgres -c shared_buffers=256MB -c max_connections=50
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: default_db
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - web_net
    ports:
      - "127.0.0.1:5432:5432"

networks:
  web_net:
    external: true

volumes:
  pg_data:
    ```

    **Note:** Ensure that the `DB_URL` in your `members-only` service's environment variables matches the PostgreSQL service configuration (e.g., `DB_URL: postgresql://user:password@main_db:5432/db_name`).

3.  **Build and start the Docker containers:**
    ```bash
    docker compose up -d --build
    ```

4.  **Populate the database:**
    Once the `members-only` container is running, execute the populate script:
    ```bash
    docker exec -it members-only bun run populate
    ```

## Development

Run in development mode with auto-reload:
```bash
bun run dev
```

Build for production:
```bash
bun run build
```

Start production server:
```bash
bun run start
```

## Features Implemented

- User registration with form validation
- Secure login/logout functionality
- Membership upgrade with secret passcode
- Create messages (authenticated users only)
- View all messages with conditional information display
- Admin dashboard with message moderation
- Role-based content visibility
- Session persistence across server restarts

## Project Structure
```
src/
├── configs/         # Configuration files (Passport, environment)
├── controllers/     # Request handlers and business logic
├── db/             # Database queries and connection pool
├── models/         # TypeScript types and validation schemas
├── routes/         # Express route definitions
├── utils/          # Helper functions
└── views/          # EJS templates
```

## Key Learning Outcomes

This project reinforced understanding of:
- Full authentication flow from registration to session management
- Implementing multi-level authorization systems
- Secure coding practices for web applications
- PostgreSQL integration with Node.js
- TypeScript in a full-stack context
- Separation of concerns in application architecture

---

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.