import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function generateSlug(title: string, isbn: string) {
    const cleanTitle = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

    return `${cleanTitle}-${isbn}`;
}

async function main() {
    console.log('Start seeding...');

    // --- USERS ---
    const passwordHash = await bcrypt.hash('password123', 10);

    await prisma.user.deleteMany({});

    await prisma.user.create({
        data: {
            firstName: 'Employee',
            lastName: 'Test',
            email: 'employee@test.com',
            password: passwordHash,
            role: 'employee',
        },
    });

    const customer = await prisma.user.create({
        data: {
            firstName: 'Customer',
            lastName: 'Test',
            email: 'customer@test.com',
            password: passwordHash,
            role: 'customer',
        },
    });

    // --- ADDRESS ---
    const address = await prisma.address.create({
        data: {
            userId: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            street: '123 Main St',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            country: 'USA',
            isDefault: true,
        },
    });

    // --- CATEGORIES ---
    await prisma.bookCategory.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.category.deleteMany({});

    const categoriesData = [
        { name: 'Fiction', slug: 'fiction' },
        { name: 'Mystery', slug: 'mystery' },
        { name: 'Fantasy', slug: 'fantasy' },
        { name: 'Thriller', slug: 'thriller' },
        { name: 'Science Fiction', slug: 'sci-fi' },
        { name: 'Romance', slug: 'romance' },
        { name: 'Horror', slug: 'horror' },
        { name: 'Biography', slug: 'biography' },
        { name: 'History', slug: 'history' },
        { name: 'Young Adult', slug: 'young-adult' },
    ];

    const categories: Record<string, { id: number; name: string; slug: string }> = {};
    for (const cat of categoriesData) {
        const c = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categories[cat.slug] = c;
    }

    // --- BOOKS ---
    const booksData = [
        {
            isbn: '9780307474278',
            title: 'The Girl with the Dragon Tattoo',
            author: 'Stieg Larsson',
            description: 'A gripping thriller about mystery and corruption.',
            price: 15.99,
            categories: ['fiction', 'mystery', 'thriller'],
            quantity: 10,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
            pageCount: 465,
            printType: 'Hardcover',
            publisher: 'Vintage Crime/Black Lizard',
            publishedDate: new Date('2008-09-16'),
        },
        {
            isbn: '9780439139601',
            title: 'Harry Potter and the Goblet of Fire',
            author: 'J.K. Rowling',
            description: 'The fourth book in the Harry Potter series.',
            price: 12.99,
            categories: ['fiction', 'fantasy'],
            quantity: 20,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780439139601-L.jpg',
            pageCount: 734,
            printType: 'Hardcover',
            publisher: 'Scholastic',
            publishedDate: new Date('2000-07-08'),
        },
        {
            isbn: '9780062316097',
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Harari',
            description: 'Explores the history of humankind from ancient times to today.',
            price: 18.99,
            categories: ['history', 'biography'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
            pageCount: 498,
            printType: 'Paperback',
            publisher: 'Harper',
            publishedDate: new Date('2015-02-10'),
        },
        {
            isbn: '9780143127741',
            title: 'Educated',
            author: 'Tara Westover',
            description: 'A memoir about a woman who grows up in rural Idaho and seeks education.',
            price: 16.99,
            categories: ['biography', 'history'],
            quantity: 10,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg',
            pageCount: 334,
            printType: 'Paperback',
            publisher: 'Random House',
            publishedDate: new Date('2018-02-20'),
        },
        {
            isbn: '9780307277671',
            title: 'The Road',
            author: 'Cormac McCarthy',
            description: 'A post-apocalyptic novel about survival and fatherhood.',
            price: 14.99,
            categories: ['fiction', 'thriller'],
            quantity: 12,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780307277671-L.jpg',
            pageCount: 287,
            printType: 'Paperback',
            publisher: 'Knopf',
            publishedDate: new Date('2006-09-26'),
        },
        {
            isbn: '9780060850524',
            title: 'Brave New World',
            author: 'Aldous Huxley',
            description: 'A dystopian novel exploring futuristic society and control.',
            price: 11.99,
            categories: ['fiction', 'sci-fi'],
            quantity: 8,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
            pageCount: 268,
            printType: 'Paperback',
            publisher: 'Harper Perennial Modern Classics',
            publishedDate: new Date('2006-10-17'),
        },
        {
            isbn: '9780316015844',
            title: 'Twilight',
            author: 'Stephenie Meyer',
            description: 'A young adult vampire romance story.',
            price: 10.99,
            categories: ['fiction', 'young-adult', 'romance'],
            quantity: 25,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg',
            pageCount: 498,
            printType: 'Paperback',
            publisher: 'Little, Brown and Company',
            publishedDate: new Date('2005-10-05'),
        },
        {
            isbn: '9780394800011',
            title: 'Where the Wild Things Are',
            author: 'Maurice Sendak',
            description: "A classic children's book about imagination and adventure.",
            price: 8.99,
            categories: ['fiction', 'young-adult'],
            quantity: 30,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780394800011-L.jpg',
            pageCount: 48,
            printType: 'Hardcover',
            publisher: 'Harper & Row',
            publishedDate: new Date('1963-04-09'),
        },
        {
            isbn: '9781451673319',
            title: 'Fahrenheit 451',
            author: 'Ray Bradbury',
            description: 'Dystopian novel about book burning and censorship.',
            price: 12.5,
            categories: ['fiction', 'sci-fi'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
            pageCount: 249,
            printType: 'Paperback',
            publisher: 'Simon & Schuster',
            publishedDate: new Date('2012-01-10'),
        },
        {
            isbn: '9780141439600',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            description: 'A classic romance novel about manners and marriage.',
            price: 9.99,
            categories: ['fiction', 'romance'],
            quantity: 18,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg',
            pageCount: 279,
            printType: 'Paperback',
            publisher: 'Penguin Classics',
            publishedDate: new Date('2002-12-31'),
        },
        {
            isbn: '9780385504201',
            title: 'The Da Vinci Code',
            author: 'Dan Brown',
            description: 'Mystery thriller exploring secret societies and conspiracies.',
            price: 14.99,
            categories: ['fiction', 'mystery', 'thriller'],
            quantity: 20,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780385504201-L.jpg',
            pageCount: 489,
            printType: 'Hardcover',
            publisher: 'Doubleday',
            publishedDate: new Date('2003-04-03'),
        },
        {
            isbn: '9780618260300',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            description: 'A fantasy adventure prequel to the Lord of the Rings.',
            price: 13.99,
            categories: ['fiction', 'fantasy'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780618260300-L.jpg',
            pageCount: 310,
            printType: 'Paperback',
            publisher: 'Houghton Mifflin Harcourt',
            publishedDate: new Date('2002-09-21'),
        },
        {
            isbn: '9780061120084',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            description: 'Classic novel about race, injustice, and morality.',
            price: 12.5,
            categories: ['fiction', 'history'],
            quantity: 18,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
            pageCount: 336,
            printType: 'Paperback',
            publisher: 'Harper Perennial Modern Classics',
            publishedDate: new Date('2006-05-23'),
        },
        {
            isbn: '9780307387899',
            title: 'Gone Girl',
            author: 'Gillian Flynn',
            description: 'Psychological thriller about marriage, deception, and crime.',
            price: 15.0,
            categories: ['fiction', 'mystery', 'thriller'],
            quantity: 12,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg',
            pageCount: 422,
            printType: 'Paperback',
            publisher: 'Crown Publishing Group',
            publishedDate: new Date('2012-06-05'),
        },
        {
            isbn: '9780140449266',
            title: 'The Odyssey',
            author: 'Homer',
            description: 'Epic Greek poem about Odysseus’s journey home after the Trojan War.',
            price: 10.99,
            categories: ['fiction', 'history'],
            quantity: 20,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg',
            pageCount: 541,
            printType: 'Paperback',
            publisher: 'Penguin Classics',
            publishedDate: new Date('1996-11-01'),
        },
        {
            isbn: '9780553386790',
            title: 'The Martian',
            author: 'Andy Weir',
            description: 'A sci-fi survival story on Mars.',
            price: 16.99,
            categories: ['fiction', 'sci-fi', 'thriller'],
            quantity: 25,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780553386790-L.jpg',
            pageCount: 369,
            printType: 'Paperback',
            publisher: 'Crown',
            publishedDate: new Date('2014-02-11'),
        },
        {
            isbn: '9780062073488',
            title: 'The Book Thief',
            author: 'Markus Zusak',
            description: 'Historical novel about a girl living in Nazi Germany.',
            price: 14.99,
            categories: ['fiction', 'history', 'young-adult'],
            quantity: 18,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg',
            pageCount: 552,
            printType: 'Paperback',
            publisher: 'Knopf Books for Young Readers',
            publishedDate: new Date('2007-09-11'),
        },
        {
            isbn: '9780143127796',
            title: 'The Night Circus',
            author: 'Erin Morgenstern',
            description: 'A fantasy novel about a magical competition and romance.',
            price: 13.99,
            categories: ['fiction', 'fantasy', 'romance'],
            quantity: 10,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780143127796-L.jpg',
            pageCount: 387,
            printType: 'Paperback',
            publisher: 'Anchor',
            publishedDate: new Date('2011-09-13'),
        },
        {
            isbn: '9780345803481',
            title: 'Fifty Shades of Grey',
            author: 'E. L. James',
            description: 'Romance novel about an intense relationship.',
            price: 11.99,
            categories: ['fiction', 'romance'],
            quantity: 22,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780345803481-L.jpg',
            pageCount: 514,
            printType: 'Paperback',
            publisher: 'Vintage',
            publishedDate: new Date('2012-04-03'),
        },
        {
            isbn: '9780062457714',
            title: 'It',
            author: 'Stephen King',
            description: 'Horror novel about a terrifying clown haunting a town.',
            price: 15.99,
            categories: ['fiction', 'horror'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg',
            pageCount: 1138,
            printType: 'Hardcover',
            publisher: 'Scribner',
            publishedDate: new Date('2011-09-15'),
        },
    ];

    const createdBooks = [];
    for (const b of booksData) {
        const slug = generateSlug(b.title, b.isbn);
        const book = await prisma.book.upsert({
            where: { isbn: b.isbn },
            create: {
                isbn: b.isbn,
                title: b.title,
                slug,
                author: b.author,
                description: b.description,
                price: b.price,
                isFeatured: b.isFeatured,
                imageURL: b.imageURL,
                pageCount: b.pageCount,
                publisher: b.publisher,
                printType: b.printType,
                publishedDate: b.publishedDate,
            },
            update: {
                title: b.title,
                author: b.author,
                description: b.description,
                price: b.price,
                isFeatured: b.isFeatured,
                imageURL: b.imageURL,
                pageCount: b.pageCount,
                publisher: b.publisher,
                printType: b.printType,
                publishedDate: b.publishedDate,
            },
        });

        // Inventory
        await prisma.inventory.upsert({
            where: { bookId: book.id },
            update: { quantity: b.quantity },
            create: { bookId: book.id, quantity: b.quantity },
        });

        // Book-Category
        await prisma.bookCategory.deleteMany({ where: { bookId: book.id } });
        for (const catSlug of b.categories) {
            await prisma.bookCategory.create({
                data: { bookId: book.id, categoryId: categories[catSlug].id },
            });
        }

        createdBooks.push(book);
    }

    // --- ORDERS ---
    await prisma.order.deleteMany({ where: { userId: customer.id } });

    // Order 1 - Payment Succeeded
    await prisma.order.create({
        data: {
            userId: customer.id,
            addressId: address.id,
            subtotal: 15.99,
            tax: 1.28,
            shipping: 5.0,
            total: 22.27,
            status: OrderStatus.PROCESSING,
            paymentStatus: PaymentStatus.PAID,
            shippingFirstName: customer.firstName,
            shippingLastName: customer.lastName,
            shippingStreet: address.street,
            shippingCity: address.city,
            shippingState: address.state,
            shippingZip: address.zip,
            shippingCountry: address.country,
            items: {
                create: [{ bookId: createdBooks[0].id, quantity: 1, price: createdBooks[0].price }],
            },
        },
    });

    // Order 2 - Order Shipped
    await prisma.order.create({
        data: {
            userId: customer.id,
            addressId: address.id,
            subtotal: 28.98,
            tax: 2.32,
            shipping: 5.0,
            total: 36.3,
            status: OrderStatus.SHIPPED,
            paymentStatus: PaymentStatus.PAID,
            shippingFirstName: customer.firstName,
            shippingLastName: customer.lastName,
            shippingStreet: address.street,
            shippingCity: address.city,
            shippingState: address.state,
            shippingZip: address.zip,
            shippingCountry: address.country,
            items: {
                create: [
                    { bookId: createdBooks[0].id, quantity: 1, price: createdBooks[0].price },
                    { bookId: createdBooks[1].id, quantity: 1, price: createdBooks[1].price },
                ],
            },
        },
    });

    // Order 3 - Order Completed/Delivered
    await prisma.order.create({
        data: {
            userId: customer.id,
            addressId: address.id,
            subtotal: 44.97,
            tax: 3.6,
            shipping: 5.0,
            total: 53.57,
            status: OrderStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID,
            shippingFirstName: customer.firstName,
            shippingLastName: customer.lastName,
            shippingStreet: address.street,
            shippingCity: address.city,
            shippingState: address.state,
            shippingZip: address.zip,
            shippingCountry: address.country,
            items: {
                create: [
                    { bookId: createdBooks[0].id, quantity: 1, price: createdBooks[0].price },
                    { bookId: createdBooks[1].id, quantity: 1, price: createdBooks[1].price },
                    { bookId: createdBooks[2].id, quantity: 1, price: createdBooks[2].price },
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
