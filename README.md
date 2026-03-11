# Skillshare Clone - Online Learning Platform

A modern online learning platform built with Vue 3, inspired by Skillshare. This application allows users to browse courses, enroll in classes, interact with instructors, and manage their learning journey through a user-friendly interface.

## Features

- **Course Discovery**: Browse and search through a wide range of courses with advanced filtering and pagination.
- **User Authentication**: Secure login and signup flow with role-based access support.
- **Course Details**: Detailed course pages with curriculum, instructor information, reviews, and FAQs.
- **Dashboard**: Personalized user dashboard for managing enrolled courses and profile settings.
- **Responsive Design**: Mobile-first design using Tailwind CSS for optimal viewing on all devices.
- **Extensible Backend**: Prisma-based backend starter added for a fresh PostgreSQL setup.
- **Learning Paths**: Structured learning paths for beginners, intermediate, and advanced learners.
- **Instructor Spotlights**: Highlight featured instructors and their courses.
- **Blog Integration**: Read and engage with educational blog posts.
- **Newsletter Signup**: Stay updated with the latest courses and platform news.

## Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **Backend**: Express + Prisma API in `server/` (PostgreSQL/Supabase compatible)
- **Icons**: Heroicons
- **Animations**: AOS (Animate On Scroll)
- **Utilities**: VueUse, date-fns, vue-slider-component

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- PostgreSQL database if you want to run the new Prisma API

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd skillshare-clone
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```
4. Configure frontend API base URL in `.env`:
   ```sh
   VITE_API_BASE_URL=http://localhost:4000/api/v1
   ```
   For profile photo uploads via Supabase Storage:
   ```sh
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   VITE_SUPABASE_AVATAR_BUCKET=avatars
   ```
   Create the `avatars` bucket as public (or update bucket name accordingly).
5. Start backend using setup from `server/README.md`.

## Usage

### Development

```sh
npm run dev
```

Runs the app in development mode with hot reloading.

### Production Build

```sh
npm run build
```

Builds the app for production to the `dist` folder.

### Preview Production Build

```sh
npm run preview
```

Locally preview the production build.

## QA

### Backend tests

```sh
cd server
npm test
```

### Frontend E2E tests (Playwright)

```sh
npm run test:e2e
```

Notes:
- E2E tests assume the app is running at `http://localhost:5173` by default.
- To override base URL: set `E2E_BASE_URL`.

### QA plan

See `QA_PLAN.md` for the current checklist and progress.

## Project Structure

```txt
src/
|-- assets/          # Static assets (images, styles, etc.)
|-- components/      # Reusable Vue components
|   |-- auth/        # Authentication components
|   |-- Courses/     # Course-related components
|   |-- Global/      # Global layout components
|   |-- Home/        # Home page components
|   `-- UI/          # UI utility components
|-- data/            # Static JSON data files
|-- router/          # Vue Router configuration
|-- store/           # Vuex store modules
|-- views/           # Page-level Vue components
`-- main.js          # Application entry point
public/              # Public static files
```

## Git Ignore Notes

The repository ignores local runtime/build artifacts such as:

- logs (`*.log`, `*.out.log`, `*.err.log`, `*.pid`)
- cache folders (`.cache`, `.vite`, `.turbo`)
- local env files (`.env`, `.env.local`, `.env.*.local`)

Keep secrets only in local env files and do not commit generated logs.

The repository also ignores Playwright artifacts (`playwright-report/`, `test-results/`).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) for the best development experience.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
