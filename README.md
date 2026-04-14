# StoryShelf :books:

## Bookstore Inventory Tracking &amp; E-Commerce Platform

https://storyshelf.vercel.app/

### **Contributors**

Ashley Smith  
Ricardo Ramos  
Beatriz Miranda

### **Purpose**

Provide a full-stack web application allowing bookstores to manage inventory using ISBN scanning to track inventory, add/edit book details, and publish to online storefront for customers to order from.

### **Features**

- Role-based registration and login for employees and customers
- Inventory Management (employees)
-- Adding books to inventory using ISBN or title
-- Stock and price management
-- Book detail editing
- Order Management (employees)
-- Update order and payment statuses
- Online Ordering (customers)
-- Browse books in inventory
-- Cart and checkout features
- Order History (customers)
-- At a glance and details

### **Technology**

Frontend: Next.js, CSS, Tailwind
Backend: Next.js API Routes
Database: PostgreSQL  
Deployment: Vercel  
Version Control: GitHub
External APIs: Google Books API

### **ORDER + PAYMENT STATUS GUIDE**

### Cart (not checked out)

OrderStatus = PENDING
PaymentStatus = PENDING

### Checkout started (Stripe session created)

OrderStatus = PROCESSING
PaymentStatus = PENDING

### Payment successful

OrderStatus = PROCESSING
PaymentStatus = PAID

### Order shipped

OrderStatus = SHIPPED
PaymentStatus = PAID

### Order completed/delivered

OrderStatus = COMPLETED
PaymentStatus = PAID

### Payment failed / order cancelled

OrderStatus = CANCELLED
PaymentStatus = FAILED

### **Contributors Favorite Quotes**

"I am no man." - Eowyn (Lord of the Rings)

"It's no use going back to yesterday because I was a different person then." — Alice (Alice's Adventures in Wonderland)

"Be Ye Men of Valour" - Winston Churchill