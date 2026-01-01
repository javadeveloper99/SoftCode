# SoftCode AI Chat Assistant

This is a small interactive scaffold (Vite + React + Tailwind) to showcase the SoftCode AI Chat Assistant UI.

Features included:
- Left features list (context-aware, code review, architecture suggestions...)
- Right chat UI mockup with glassmorphism and neon glow
 
- Framer Motion-ready animations and Lottie placeholder for AI brain

Quick start (Windows PowerShell):

```powershell
npm install
npm run dev
# SoftCode AI Chat Assistant 

This repository contains a small interactive scaffold (Vite + React + Tailwind) showcasing the SoftCode AI Chat Assistant UI.

## Team Members

1. Vivek Sheshrao Sanap
2. Sri Sabair Doss R
3. Kavin P
4. Amogh Hosamane

## Current status (as of 2025-11-30)

- Project scaffold: Vite + React + Tailwind CSS
- Homepage with feature list and `ChatMockup` component (mock chat UI)
- `ChatMockup` accepts messages locally and shows them inline; explicit "Open full chat" navigates to `/chat` with the last message passed as navigation state
- Routing implemented with `react-router-dom` (`/` and `/chat` routes)
- `ChatPage`, `ProfileMenu`, and `FeedbackModal` components exist
- Lottie animation placeholder and Framer Motion animations are used on the homepage
- `ContactSection` component exists but was removed from the homepage (kept in repo for reuse)

## Quick start (Windows PowerShell)

From the project root (no absolute paths):

```powershell
npm install
npm run dev
```

Open the development server (usually http://localhost:3000) to view the app.

# Front-End  Improvements
# 10-20

1. Instant message send (no lag perception)
2. Typing indicator (AI “thinking” feedback)
3. Streaming responses (word-by-word)
4. Message retry on failure
5. Clear error state for failed messages
6. Input auto-focus on page load
7. Enter-to-send + Shift+Enter for new line
8. Message timestamps (subtle)
9. Scroll-to-bottom on new messages
10. “Jump to latest” button when scrolled up
11. Disable send button when input empty
12. Message bubble distinction (user vs AI)
13. Long response wrapping correctly
14. Copy message button (one click)
15. Code block formatting (monospace + copy)
16. Markdown rendering (lists, bold, links)
17. Message skeleton loaders
18. Chat clear/reset button
19. Persistent chat during refresh (session)
20. Keyboard-only usable chat (basic)


