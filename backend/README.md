# Akrio Resume Match Backend

The backend powers Akrio Resume Match, an AI resume analyzer. It provides account registration and email verification, access and refresh token authentication, resume-to-job-description analysis, and an admin-only registered-user list.

## Technology

- Node.js and TypeScript
- Express 5
- MongoDB and Mongoose
- Zod request validation
- JSON Web Tokens
- Nodemailer and Pug for email verification
- Google Gemini for resume analysis

## Requirements

- Node.js
- pnpm
- A reachable MongoDB database
- SMTP credentials for sending verification emails

## Setup

From this directory, install the dependencies:

```sh
pnpm install
```

Create a `.env` file in the `backend` directory. The server validates the required variables at startup.

```dotenv
PORT=8000
API_URL=http://localhost:8000
NODE_ENV=development
SALT_ROUND=10
MONGODB_URI=mongodb://127.0.0.1:27017/akrio-resume-match
JWT_ACCESS_TOKEN_SECRETE=replace-with-a-long-random-secret
JWT_REFRESH_TOKEN_SECRETE=replace-with-a-different-long-random-secret
ACCESS_JWT_EXPIRES_IN=15m
REFRESH_JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
SMTP_PASS=your-smtp-password
OTP_EXPIRY_MINUTES=15
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=replace-with-a-strong-password
SUPER_ADMIN_NAME=System Administrator
OPEN_AI_APIKEY=your-google-ai-api-key
```

Use different, randomly generated secrets for the access and refresh JWTs. Do not commit `.env` or put real credentials in documentation or source control. Set the SMTP values to a mail provider that permits the application to send email. The OTP email flow depends on this configuration.

Use different, randomly generated values for the access and refresh JWT secrets. Never commit `.env` or place real credentials in documentation or source control.

## Run the Server

Start the development server with automatic TypeScript reloads:

```sh
pnpm dev
```

The server connects to MongoDB before it starts listening. By default, the API is expected at `http://localhost:8000` when `PORT=8000`.

Build and type-check the project:

```sh
pnpm build
pnpm type-check
```

After building, start the compiled server with:

```sh
pnpm start
```

The package currently does not contain an automated test suite.

## API Routes

All routes use the `/api/v1` prefix. Protected routes require a bearer access token in the `Authorization` header.

### Authentication

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/api/v1/auth/register` | Register an account and send an email verification code |
| POST | `/api/v1/auth/verify` | Verify an account using the emailed code |
| POST | `/api/v1/auth/login` | Sign in and receive access and refresh tokens |
| POST | `/api/v1/auth/refresh` | Rotate the refresh token and receive a new token pair |

Refresh tokens are stored as hashes. Reusing a rotated token is rejected.

### Resume Analysis

| Method | Path | Access | Purpose |
| ------ | ---- | ------ | ------- |
| POST | `/api/v1/resume/analyze` | Authenticated | Compare a resume with a job description |

Send `multipart/form-data` with a file field named `resume` and a `jobDescription` text field. PDF and DOCX files up to 5 MB are accepted. The job description must contain 20 to 10,000 characters. The response includes a match score, matched/partial/missing skills, strengths, improvements, and interview questions.

The uploaded file is deleted after processing. Extracted resume text is stored with the analysis.

### Administration

| Method | Path | Access | Purpose |
| ------ | ---- | ------ | ------- |
| GET | `/api/v1/admin/users?page=1&limit=20` | Admin role (`1`) | List registered regular-user accounts |

The user list is newest-first and paginated. It returns names, email addresses, email-verification status, role, and registration date; credentials are not returned. Seed or promote the configured administrator with `pnpm run seed:admin`.

### Health

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/` | Basic server health response |

## Response Format

Successful responses use a common JSON envelope:

```json
{
  "success": true,
  "status": 200,
  "message": "Request completed successfully",
  "data": {}
}
```

The `data` field may be omitted for actions that do not return a record. Errors include a `success: false` value, an HTTP status, and a message. Validation errors may also include field-level details.

## Notes

- Keep database, SMTP, JWT, and AI credentials outside source control.
- Run the frontend separately; its `VITE_API_URL` should point to this server's `/api/v1` base URL.
