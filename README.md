# StoryShelf :books:

## Bookstore Inventory Tracking &amp; E-Commerce Platform

### **Contributors**

Ashley Smith  
Ricardo Ramos  
Beatriz Miranda

### **Purpose**

Provide a full-stack web application allowing bookstores to manage inventory using ISBN scanning to track inventory, add/edit book details, and publish to online storefront for customers to order from.

### **Features**

- Role-based login for admin/employee/customer
- Add books to inventory using ISBN barcode
- Manual entry and editing options for book details
- Inventory management options
- Online storefront with checkout ability for customers
- viewable Order History for customers

### **Technology**

Frontend: Next.js, CSS
Backend: Next.js API Routes
Database: PostgreSQL  
Deployment: Vercel  
Version Control: GitHub
External APIs: Google Books API

### **Favorite Quotes**

"I am no man." - Eowyn (Lord of the Rings)

"It's no use going back to yesterday because I was a different person then." — Alice (Alice's Adventures in Wonderland)

"Be Ye Men of Valour" - Winston Churchill

### **Default Setup**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Local Database Setup (Development Only)

This project uses a **local PostgreSQL database** during development. Each team member will run their own database instance until we migrate to a shared cloud database (Neon/Vercel) later in the project.

---

## Prerequisites

Make sure you have the following installed:

- PostgreSQL
- pgAdmin 4 (or another PostgreSQL GUI)
- Node.js and npm

---

## 1. Create a Local Database

1. Open pgAdmin 4
2. Connect to your local PostgreSQL server
3. Right-click **Databases → Create → Database…**
4. Enter the following:

```
Database Name: bookstore_db
Owner: postgres (default)
```

5. Click **Save**

---

## 2. Configure Environment Variables

Create a `.env` file in the root of the project (if it does not already exist):

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bookstore_db"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

> ⚠️ Do NOT commit `.env` files to version control.

---

## 3. Run Database Migrations

Run the following command to create the database tables:

```
npx prisma migrate dev --name init
```

This will:

- Create all tables based on the Prisma schema
- Generate the Prisma client

---

## 4. Start the Development Server

```
npm run dev
```

Then open:

```
http://localhost:3000/dashboard
```

You should see:

```
Books in DB: 0
```

---

## 5. Development Workflow

- Each developer has their **own local database**
- Data is **not shared between team members**
- The database schema is shared through Prisma migrations

---

## 6. Updating the Database Schema

When changes are made to `schema.prisma`:

### If you made the change:

```
npx prisma migrate dev --name <change-name>
```

### If pulling changes from GitHub:

```
npx prisma migrate dev
```

---

## 7. Important Notes

- Do not edit the database manually unless necessary
- Always pull the latest changes before running migrations
- Only one person should modify the schema at a time to avoid conflicts

---

## 8. Future Deployment

In later sprints, we will switch to a shared hosted database using Neon and deploy the application using Vercel.

At that point:

- All developers will use the same `DATABASE_URL`
- Data will be shared across the team

---

## Troubleshooting

### pgAdmin shows no servers

- Ensure PostgreSQL is installed
- Register a new server in pgAdmin using:
    - Host: localhost
    - Port: 5432
    - Username: postgres

---

### Migration fails

- Check your `DATABASE_URL`
- Ensure PostgreSQL is running
- Verify the database exists

---

### Cannot connect to database

- Confirm username/password
- Confirm port is 5432
- Restart PostgreSQL service if needed
