# Mutual — Community Skills Exchange Platform

## Overview
Mutual is a no-money community skill exchange web app where neighbours list skills they can offer and request skills they need in return. No payments. No middlemen. Just neighbours helping neighbours. Built as a 4-week MVP for the AmaliTech Voluntary Internship 2026.

## Team
- **Eleanor Essilfie** — UI/UX Design & Frontend (Next.js)
- **Emmanuel Amoah** — Backend (Spring Boot + MySQL)

## Live Demo
https://mutual-app-seven.vercel.app

## Tech Stack
### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Deployed on Vercel

### Backend
- Spring Boot (Java)
- MySQL
- Deployed on Railway

## Pages
| Route | Page | Description |
|-------|------|-------------|
| /browse | Browse Skills | Main discovery page — search and filter skill listings |
| /auth | Sign In / Sign Up | Create account or sign in |
| /profile | My Profile | Own profile with editable skills and about section |
| /users/[id] | User Profile | Other user's profile — propose a swap |
| /post-skill | Post a Skill | List a new skill for exchange |
| /messages | Messages | Conversations between users |

## API Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create a new account | No |
| POST | /api/auth/login | Sign in, returns JWT token | No |
| GET | /api/skills | Get all skill listings | No |
| POST | /api/skills | Post a new skill listing | Yes |
| GET | /api/users/:id | Get a user profile | No |
| POST | /api/messages | Send a message | Yes |

## System Architecture
https://www.figma.com/board/XlzkX8pOizyl4VnMJ6Voo1

## Design File
https://www.figma.com/design/9rMBK9V7BGVW4F49j4kfR9

## Local Setup — Frontend
git clone https://github.com/ehllyy/mutual-app.git
cd mutual-app/frontend
npm install
npm run dev
Open http://localhost:3000

## Local Setup — Backend
cd mutual-app/backend
Configure MySQL in application.properties
./mvnw spring-boot:run

## GitHub Repository
https://github.com/ehllyy/mutual-app
