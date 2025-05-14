# Project Directory Structure

This document provides a detailed breakdown of the project's directory structure and its contents.

## Root Directory

```
/
├── frontend/               # React frontend application
├── backend/               # Backend services
├── documentation/         # Project documentation
├── guides/               # Feature implementation guides
├── DailyReflections/     # Daily development reflections
├── .git/                 # Git repository data
├── .gitignore           # Git ignore rules
├── README.md            # Project main documentation
└── day2Plan.md          # Day 2 development plan
```

## Frontend (`/frontend`)

```
frontend/
├── src/                  # Source code
├── public/              # Static assets
├── scripts/             # Build and utility scripts
├── node_modules/        # Dependencies
├── package.json         # Frontend dependencies and scripts
├── package-lock.json    # Dependency lock file
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
├── index.html           # Entry HTML file
└── README.md           # Frontend documentation
```

## Backend (`/backend`)

```
backend/
├── api-gateway/         # API Gateway service
├── auth-service/        # Authentication service
└── blog-service/        # Blog management service
```

## Documentation (`/documentation`)

```
documentation/
└── Day1APIDocumentation.md  # API documentation for Day 1
```

## Guides (`/guides`)

```
guides/
├── post-feature-guide.md    # Guide for post feature implementation
├── like-feature-guide.md    # Guide for like feature implementation
└── comment-feature-guide.md # Guide for comment feature implementation
```

## Key Files

- `README.md`: Main project documentation
- `day2Plan.md`: Development plan for day 2
- `.gitignore`: Specifies files and directories to be ignored by Git

## Project Structure Overview

This is a full-stack blog application with a microservices architecture:

1. **Frontend**: React-based single-page application using Vite as the build tool
2. **Backend**: Microservices architecture with:
   - API Gateway for routing and request handling
   - Authentication Service for user management
   - Blog Service for blog content management
3. **Documentation**: Contains API documentation and implementation guides
4. **Guides**: Detailed guides for implementing specific features

The project follows a modular structure with clear separation of concerns between frontend and backend services, making it maintainable and scalable. 