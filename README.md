# GoGoCash

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%praashh%2Fgogocash&env=DATABASE_URL,DIRECT_URL,BETTER_AUTH_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,SHOPEEXTRA_API_KEY,NEXT_PUBLIC_SHOPEEXTRA_PREFIX,SHOPEEXTRA_API_SECRET,REDIS_PASSWORD,REDIS_PORT,REDIS_USER,REDIS_HOST&envDescription=For%20more%20info%20on%20setting%20up%20your%20API%20keys%2C%20checkout%20the%20Readme%20below&envLink=https%3A%2F%2Fgithub.com%2Fpraashh%2Fgogocash%2Fblob%2Fmain%2FREADME.md&project-name=gogocash&repository-name=gogocash&redirect-url=gogocash&demo-title=GoGoCash)

## Tech Stack

This is built with modern and reliable technologies:

- **Frontend**: Next.js, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Next.js API and Server actions
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: Next Auth
- **Caching**: Redis

## Getting Started

### Prerequisites

**Required Versions:**

- Node.js >= 23.0.0
- Docker >= 20.10.0

Before running the application, you'll need to set up several services and environment variables:

For more in-depth information on environment variables, please refer to the [Environment Variables](#environment-variables) section.

1. **Setup Local**
   - Make sure you have [Docker](https://docs.docker.com/get-docker/), [NodeJS](https://nodejs.org/en/download/), and [bun](https://bun.sh/docs/installation) installed.
   - Open codebase as a container in [VSCode](https://code.visualstudio.com/) or your favorite VSCode fork.
   - Run the following commands in order to populate your dependencies and setup docker

     ```
     npm install
     ```

   - Run the following commands if you are unable to start any of the services

     ```
     rm -rf node_modules
     ```

2. **Next Auth Setup**
   - Open the `.env` file and change the AUTH_SECRET to string given below.

     ```env
     NEXTAUTH_SECRET= '<YOUR_SECRET>'
     ```

3. **Environment Variables**

Copy `.env.example` located in `.env` in the configure the following variables:

```env
# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=     # Required: Secret key for authentication

# Database ( Required )
DATABASE_URL=
DIRECT_URL=

# Redis ( Required )
REDIS_PASSWORD=
REDIS_PORT=
REDIS_USER=
REDIS_HOST=

# Involve Asia ( Required )
NEXT_PUBLIC_SHOPEEXTRA_PREFIX=
SHOPEEXTRA_API_KEY=
SHOPEEXTRA_API_SECRET=
```

Migration the database by running `npm run db:migrate` and generate prisma client `npm run db:generate`.

### Running Locally

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contribute

Contributions are welcome ❤️.
