# Akrio Resume Match Frontend

The frontend is the public website and authenticated workspace for Akrio Resume Match. Users compare a PDF or DOCX resume with a job description and review an AI-generated match score, skill feedback, strengths, improvements, and interview questions. Admins can review registered user accounts.

## Technology

- React 19
- Vite
- React Router
- TanStack Query
- Axios
- React Hook Form and Zod
- Tailwind CSS 4
- Recharts

## Requirements

- Node.js
- pnpm
- The Akrio Resume Match backend running and reachable from the browser

## Setup

From this directory, install the dependencies:

```sh
pnpm install
```

Create a `.env` file in the `frontend` directory and set the backend API base URL. The URL should end with `/api/`.

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

If the backend is running on another host or port, replace the example URL with that server's API base URL. Restart Vite after changing environment variables. Do not commit private service URLs or credentials.

## Run the Frontend

Start the development server:

```sh
pnpm dev
```

Vite prints the local URL in the terminal, usually `http://localhost:5173`.

Run the production build:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

Run ESLint:

```sh
pnpm lint
```

## Routes

| Path | Access | Purpose |
| ---- | ------ | ------- |
| `/` | Public | Product website and registration links |
| `/login` | Public | Sign in to an existing account |
| `/register` | Public | Create an account and request email verification |
| `/verify-otp` | Public | Verify an account using the email code |
| `/analyze` | Authenticated user | Upload a resume and compare it with a job description |
| `/admin/users` | Admin role (`1`) | Review registered user accounts and verification status |
| `/dashboard` | Authenticated | Redirects to `/analyze` |

Authenticated pages share a desktop sidebar and mobile navigation drawer. After login, regular users are sent to `/analyze`; admins are sent to `/admin/users`.

## Resume Analysis

Choose a PDF or DOCX resume up to 5 MB and paste the job description (20 to 10,000 characters). The analysis view displays the match score, matched/partial/missing skills, strengths, suggested improvements, and interview questions.

The backend deletes the uploaded file after processing, but stores extracted resume text with the analysis.

## Admin User List

The admin screen retrieves user records from the admin-only `/api/v1/admin/users` endpoint. It shows registration date and email-verification status, with pagination.

## Authentication and API

The frontend sends requests to the backend URL defined by `VITE_API_URL`. Authenticated API requests include the access token. When the backend rejects an expired access token, the Axios client requests a rotated token pair using the stored refresh token, saves both new tokens, and retries the original request. If refresh fails, the local session is cleared and the user is returned to login.

The backend API is documented in [../backend/README.md](../backend/README.md).

## Project Structure

```text
src/
  app/                 Router and React Query configuration
  components/          Shared layout and UI components
  context/             Authentication state
  features/
    admin/             Admin user list
    auth/              Registration, verification, and login
    marketing/         Public website
    resume-analysis/   Resume upload, analysis API, and results
  lib/                 Shared Axios client
  routes/              Public and protected route guards
  utils/               Error and token helpers
```

## Troubleshooting

- If API requests fail, confirm that `VITE_API_URL` is correct and that the backend is running.
- If the backend is on a different origin, confirm its CORS configuration permits the frontend origin.
- If registration email verification does not arrive, check the backend SMTP configuration.
- If admin user data cannot be loaded, verify that the signed-in account has role `1` and that the backend is reachable.
