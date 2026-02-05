# Skillshare Clone - Online Learning Platform

A modern online learning platform built with Vue 3, inspired by Skillshare. This application allows users to browse courses, enroll in classes, interact with instructors, and manage their learning journey through a user-friendly interface.

## Features

- **Course Discovery**: Browse and search through a wide range of courses with advanced filtering and pagination.
- **User Authentication**: Secure login and signup with Supabase authentication.
- **Course Details**: Detailed course pages with curriculum, instructor information, reviews, and FAQs.
- **Dashboard**: Personalized user dashboard for managing enrolled courses and profile settings.
- **Responsive Design**: Mobile-first design using Tailwind CSS for optimal viewing on all devices.
- **Real-time Updates**: Integration with Supabase for real-time data synchronization.
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
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Icons**: Heroicons
- **Animations**: AOS (Animate On Scroll)
- **Utilities**: VueUse, date-fns, vue-slider-component

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account and project

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

3. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory and add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

4. Start the development server:
   ```sh
   npm run dev
   ```

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

## Project Structure

```
src/
├── assets/          # Static assets (images, styles, etc.)
├── components/      # Reusable Vue components
│   ├── auth/        # Authentication components
│   ├── Courses/     # Course-related components
│   ├── Global/      # Global layout components
│   ├── Home/        # Home page components
│   └── UI/          # UI utility components
├── data/            # Static JSON data files
├── router/          # Vue Router configuration
├── store/           # Vuex store modules
├── views/           # Page-level Vue components
└── main.js          # Application entry point
public/              # Public static files
```

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
