import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Hash password for all users
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Users
    const _user1 = await prisma.user.create({
        data: {
            firstName: 'Ashley',
            lastName: 'Smith',
            email: 'ashley@example.com',
            password: passwordHash,
            role: 'employee',
        },
    });

    const _user2 = await prisma.user.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: passwordHash,
            role: 'customer',
        },
    });

    // Create Categories
    const fiction = await prisma.category.create({ data: { name: 'Fiction', slug: 'fiction' } });
    const mystery = await prisma.category.create({ data: { name: 'Mystery', slug: 'mystery' } });
    const fantasy = await prisma.category.create({ data: { name: 'Fantasy', slug: 'fantasy' } });
    const thriller = await prisma.category.create({ data: { name: 'Thriller', slug: 'thriller' } });
    const sciFi = await prisma.category.create({
        data: { name: 'Science Fiction', slug: 'sci-fi' },
    });

    // Create 10 Books
    const books = [
        {
            isbn: '9780307474278',
            title: 'The Girl with the Dragon Tattoo',
            author: 'Stieg Larsson',
            description: 'A gripping thriller about mystery and corruption.',
            price: 15.99,
            categories: [fiction.id, mystery.id, thriller.id],
            quantity: 10,
            isFeatured: true,
            pageCount: 465,
            printType: 'Hardcover',
            publisher: 'Norstedts Förlag',
            publishedDate: new Date('2005-08-01'),
        },
        {
            isbn: '9780439139601',
            title: 'Harry Potter and the Goblet of Fire',
            author: 'J.K. Rowling',
            description: 'The fourth book in the Harry Potter series.',
            price: 12.99,
            categories: [fiction.id, fantasy.id],
            quantity: 20,
            isFeatured: false,
            pageCount: 636,
            printType: 'Hardcover',
            publisher: 'Bloomsbury',
            publishedDate: new Date('2000-07-08'),
        },
        {
            isbn: '9780553382563',
            title: 'A Game of Thrones',
            author: 'George R.R. Martin',
            description: 'Epic fantasy novel, first in the series A Song of Ice and Fire.',
            price: 14.99,
            categories: [fiction.id, fantasy.id],
            quantity: 15,
            isFeatured: true,
            pageCount: 694,
            printType: 'Paperback',
            publisher: 'Bantam',
            publishedDate: new Date('1996-08-06'),
        },
        {
            isbn: '9780142424179',
            title: 'The Fault in Our Stars',
            author: 'John Green',
            description: 'A heartfelt young adult romance.',
            price: 10.99,
            categories: [fiction.id],
            quantity: 25,
            isFeatured: false,
            pageCount: 313,
            printType: 'Paperback',
            publisher: 'Dutton Books',
            publishedDate: new Date('2012-01-10'),
        },
        {
            isbn: '9780061120084',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            description: 'Classic novel on racial injustice and moral growth.',
            price: 9.99,
            categories: [fiction.id],
            quantity: 30,
            isFeatured: true,
            pageCount: 324,
            printType: 'Paperback',
            publisher: 'J.B. Lippincott & Co.',
            publishedDate: new Date('1960-07-11'),
        },
        {
            isbn: '9780316769488',
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            description: 'Coming-of-age story of Holden Caulfield.',
            price: 8.99,
            categories: [fiction.id],
            quantity: 20,
            isFeatured: false,
            pageCount: 277,
            printType: 'Paperback',
            publisher: 'Little, Brown and Company',
            publishedDate: new Date('1951-07-16'),
        },
        {
            isbn: '9780307277671',
            title: 'The Road',
            author: 'Cormac McCarthy',
            description: 'A post-apocalyptic tale of survival.',
            price: 11.99,
            categories: [fiction.id, thriller.id],
            quantity: 18,
            isFeatured: false,
            pageCount: 287,
            printType: 'Paperback',
            publisher: 'Alfred A. Knopf',
            publishedDate: new Date('2006-09-26'),
        },
        {
            isbn: '9781451673319',
            title: 'Fahrenheit 451',
            author: 'Ray Bradbury',
            description: 'Classic dystopian novel about censorship.',
            price: 9.49,
            categories: [fiction.id, sciFi.id],
            quantity: 22,
            isFeatured: true,
            pageCount: 194,
            printType: 'Paperback',
            publisher: 'Ballantine Books',
            publishedDate: new Date('1953-10-19'),
        },
        {
            isbn: '9780060850524',
            title: 'Brave New World',
            author: 'Aldous Huxley',
            description: 'Dystopian novel exploring societal control and technology.',
            price: 10.49,
            categories: [fiction.id, sciFi.id],
            quantity: 19,
            isFeatured: false,
            pageCount: 268,
            printType: 'Paperback',
            publisher: 'Harper Perennial Modern Classics',
            publishedDate: new Date('1932-01-01'),
        },
        {
            isbn: '9780316015844',
            title: 'Twilight',
            author: 'Stephenie Meyer',
            description: 'Vampire romance in the Pacific Northwest.',
            price: 12.49,
            categories: [fiction.id, fantasy.id],
            quantity: 24,
            isFeatured: true,
            pageCount: 498,
            printType: 'Paperback',
            publisher: 'Little, Brown and Company',
            publishedDate: new Date('2005-10-05'),
        },
    ];

    for (const b of books) {
        await prisma.book.create({
            data: {
                isbn: b.isbn,
                title: b.title,
                author: b.author,
                description: b.description,
                price: b.price,
                inventory: { create: { quantity: b.quantity } },
                isFeatured: b.isFeatured,
                pageCount: b.pageCount,
                printType: b.printType,
                publisher: b.publisher,
                publishedDate: b.publishedDate,
                categories: {
                    create: b.categories.map((catId) => ({ category: { connect: { id: catId } } })),
                },
            },
        });
    }

    // Example Order
    const _order1 = await prisma.order.create({
        data: {
            userId: _user2.id,
            subtotal: 28.98,
            tax: 2.32,
            shipping: 5.0,
            total: 36.3,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PAID,
            shippingFirstName: 'John',
            shippingLastName: 'Doe',
            shippingStreet: '123 Main St',
            shippingCity: 'Los Angeles',
            shippingState: 'CA',
            shippingZip: '90001',
            shippingCountry: 'USA',
            items: {
                create: [
                    { bookId: 1, quantity: 1, price: 15.99 },
                    { bookId: 2, quantity: 1, price: 12.99 },
                ],
            },
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
