# HackPub - Hackathon Platform

HackPub is a serverless hackathon platform that allows hosts to create hackathons and participants to join them without requiring a backend.

## Features

- **User Roles**: Register as a host or participant
- **Hackathon Creation**: Hosts can create hackathons by providing:
  - Title and description
  - Category selection
  - Banner image (or auto-generated placeholder)
  - Google Form link for participant submission
- **Hackathon Discovery**: Participants can browse and filter hackathons by category
- **Seamless Integration**: Direct redirection to Google Forms for participant submissions
- **Fully Client-Side**: Uses browser's localStorage for data persistence

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- TailwindCSS
- Client-side data storage with localStorage

## Local Development

First, clone the repository:

```bash
git clone https://github.com/yourusername/hackpub.git
cd hackpub
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How It Works

1. **Host Flow**:
   - Register as a host
   - Create hackathons with title, description, category, and Google Form link
   - View all created hackathons in the dashboard

2. **Participant Flow**:
   - Register as a participant
   - Browse available hackathons by category
   - View hackathon details
   - Click "Participate" to be redirected to the Google Form

## License

MIT

## About

This project was created to demonstrate a serverless hackathon platform that requires no backend while providing a modern and beautiful UI.
