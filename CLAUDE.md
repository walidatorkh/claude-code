# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview capabilities. It allows users to describe components they want to create and generates them using Claude AI with real-time preview and editing capabilities.

## Development Commands

### Setup
```bash
npm run setup
```
Installs dependencies, generates Prisma client, and runs database migrations.

### Development
```bash
npm run dev
```
Starts the development server at http://localhost:3000

```bash
npm run dev:daemon
```
Starts the development server in background, logging output to logs.txt

### Testing and Quality
```bash
npm test
```
Runs the test suite using Vitest

```bash
npm run lint
```
Runs ESLint to check code quality

```bash
npm run build
```
Builds the production application

### Database
```bash
npm run db:reset
```
Resets the database and runs migrations

## Architecture

### Core Technologies
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Prisma** with SQLite for data persistence
- **Anthropic Claude AI** via Vercel AI SDK
- **Vitest** for testing

### Key Components

#### Virtual File System (`src/lib/file-system.ts`)
- In-memory file system that doesn't write to disk
- Handles file creation, editing, deletion, and directory operations
- Serializes/deserializes for persistence and API communication

#### AI Integration (`src/app/api/chat/route.ts`)
- Streaming chat interface using Vercel AI SDK
- Custom tools: `str_replace_editor` and `file_manager`
- Handles both authenticated and anonymous sessions
- Auto-saves project data for registered users

#### Context Architecture
- **FileSystemContext**: Manages virtual file system state and operations
- **ChatContext**: Handles AI chat interactions and tool calls
- Both contexts work together to provide real-time code generation and editing

#### Database Schema
Reference `prisma/schema.prisma` for the complete database structure:
- **User**: Authentication with email/password, has many projects
- **Project**: Stores chat messages and file system data as JSON strings
  - `userId` is optional (supports anonymous projects)
  - `messages`: JSON array of chat conversation
  - `data`: JSON object containing virtual file system state
  - Cascade delete when user is removed

### Component Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── editor/            # Code editor and file tree
│   ├── preview/           # Component preview frame
│   └── ui/                # Shared UI components (shadcn/ui)
├── lib/
│   ├── contexts/          # React contexts for state management
│   ├── tools/             # AI tools for file operations
│   ├── transform/         # JSX transformation utilities
│   └── prompts/           # AI prompt templates
└── actions/               # Server actions for database operations
```

### Authentication
- Custom JWT-based authentication (`src/lib/auth.ts`)
- Supports both authenticated users and anonymous sessions
- Anonymous work is tracked client-side for potential account creation

### AI Tools Integration
The system provides Claude AI with two main tools:
- **str_replace_editor**: Create, edit, and manipulate files
- **file_manager**: Rename and delete files/directories

### Testing Strategy
- Component tests using Vitest + React Testing Library
- Tests located in `__tests__` directories alongside components
- Focus on core functionality: file system operations, chat interface, and component rendering

## Environment Setup

### Required Environment Variables
```
ANTHROPIC_API_KEY=your-api-key-here  # Optional - defaults to mock responses
```

### Development Notes
- The application works without an API key (returns static mock components)
- Database is SQLite in development (file: `prisma/dev.db`)
- Prisma client is generated to `src/generated/prisma/` directory
- All file operations happen in-memory - no files are written to disk during normal operation