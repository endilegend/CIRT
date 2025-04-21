# UTampa CIRT Website

A modern web application built with Next.js, featuring PDF processing capabilities, authentication, and a responsive UI using Tailwind CSS and shadcn/ui components.

## Features

- PDF processing and manipulation
- User authentication and authorization
- Responsive and modern UI using Tailwind CSS
- Form handling with React Hook Form and Zod validation
- Real-time notifications with Sonner
- Database integration with Prisma
- Firebase integration
- Email functionality with Nodemailer
- DeepSeek AI integration for article analysis and insights
- Text-to-speech read aloud functionality for articles

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **Database:** Prisma
- **Authentication:** NextAuth.js
- **Form Handling:** React Hook Form + Zod
- **State Management:** Zustand
- **PDF Processing:** pdf-lib, pdf-parse, pdf.js-extract
- **Email:** Nodemailer
- **Cloud Services:** Firebase, Supabase

## Project Structure

```
utampa-cirt/
├── src/
│   ├── app/                    # Next.js app directory (App Router)
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (dashboard)/        # Dashboard routes
│   │   ├── api/                # API routes
│   │   └── ...                 # Other pages and layouts
│   ├── components/             # React components
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   ├── forms/              # Form components
│   │   └── ...                 # Other components
│   ├── lib/                    # Utility functions and configurations
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── db.ts               # Database utilities
│   │   └── ...                 # Other utilities
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Next.js middleware
├── prisma/                     # Prisma schema and migrations
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   └── ...                     # Other static files
├── scripts/                    # Build and utility scripts
│   └── copy-pdf-worker.js      # PDF worker setup script
├── .env                        # Environment variables
├── .env.local                  # Local environment variables
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Prisma CLI
- Supabase account
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd utampa-cirt
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="your_database_url"
DIRECT_URL="your_direct_url"

# Authentication
NEXTAUTH_URL="your_app_url"
NEXTAUTH_SECRET="your_secret"

# Email
EMAIL_SERVER_HOST="your_email_host"
EMAIL_SERVER_PORT="your_email_port"
EMAIL_SERVER_USER="your_email_user"
EMAIL_SERVER_PASSWORD="your_email_password"
EMAIL_FROM="your_email_from"

# Firebase
FIREBASE_API_KEY="your_firebase_api_key"
FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
FIREBASE_PROJECT_ID="your_firebase_project_id"
FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
FIREBASE_APP_ID="your_firebase_app_id"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Development Workflow

1. **Starting the Development Server**

   ```bash
   npm run dev
   ```

   This will start the Next.js development server with hot reloading enabled.

2. **Building for Production**

   ```bash
   npm run build
   ```

   This will generate an optimized production build.

3. **Running Production Build**

   ```bash
   npm run start
   ```

   This will start the production server.

4. **Running Linter**
   ```bash
   npm run lint
   ```
   This will check for any linting errors in the codebase.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run copy-pdf-worker` - Copy PDF worker files

## Deployment

The project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration for deployment.

### Deployment Steps

1. Build the application:

```bash
npm run build
```

2. Deploy to Netlify:

```bash
netlify deploy --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
