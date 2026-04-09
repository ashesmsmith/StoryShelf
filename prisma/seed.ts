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

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.bookCategory.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.book.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    // --- USERS ---
    const passwordHash = await bcrypt.hash('password123', 10);

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
        { name: 'Non-Fiction', slug: 'non-fiction' },
        { name: 'Psychology', slug: 'psychology' },
        { name: 'Health', slug: 'health' },
        { name: 'Post-Apocalyptic', slug: 'post-apocalyptic' },
        { name: 'Classic', slug: 'classic' },
        { name: 'Children', slug: 'children' },
        { name: 'Dystopian', slug: 'dystopian' },
        { name: 'Historical', slug: 'historical' },
        { name: 'Poetry', slug: 'poetry' },
        { name: 'Adventure', slug: 'adventure' },
        { name: 'Magical Realism', slug: 'magical-realism' },
        { name: 'Epic', slug: 'epic' },
        { name: 'Literary', slug: 'literary' },
        { name: 'Picture Book', slug: 'picture-book' },
        { name: 'Middle Grade', slug: 'middle-grade' },
        { name: 'Suspense', slug: 'suspense' },
        { name: 'Science', slug: 'science' },
        { name: 'Science Fiction', slug: 'science-fiction' },
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
    const books = [
        {
            isbn: '9780307474278',
            title: 'The Da Vinci Code',
            author: 'Dan Brown',
            description:
                'Harvard symbologist Robert Langdon and cryptologist Sophie Neveu investigate a mysterious murder at the Louvre, leading them into a trail of cryptic clues and centuries-old secrets hidden in works of art. As they race across Europe, they uncover a breathtaking historical conspiracy.',
            price: 15.99,
            categories: ['fiction', 'mystery', 'thriller', 'suspense'],
            quantity: 10,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
            pageCount: 624,
            printType: 'Paperback',
            publisher: 'Anchor',
            publishedDate: new Date('2009-03-31'),
        },
        {
            isbn: '9780439139601',
            title: 'Harry Potter and the Goblet of Fire',
            author: 'J.K. Rowling',
            description:
                'In his fourth year at Hogwarts, Harry Potter is unexpectedly entered into the dangerous Triwizard Tournament. As he faces life-threatening challenges and dark forces begin to rise, he must rely on his courage and friends to survive.',
            price: 12.99,
            categories: ['fiction', 'fantasy', 'young-adult'],
            quantity: 20,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780439139601-L.jpg',
            pageCount: 752,
            printType: 'Paperback',
            publisher: 'Scholastic Paperbacks',
            publishedDate: new Date('2002-09-01'),
        },
        {
            isbn: '9780062316097',
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            description:
                'A landmark narrative exploring the history of humankind, from the emergence of Homo sapiens through the Cognitive, Agricultural, and Scientific Revolutions, blending science, history, and anthropology in an accessible and thought‑provoking way.',
            price: 18.99,
            categories: ['non-fiction', 'history', 'science'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
            pageCount: 464,
            printType: 'Hardcover',
            publisher: 'Harper',
            publishedDate: new Date('2015-02-10'),
        },
        {
            isbn: '9780143127741',
            title: 'The Body Keeps the Score: Brain, Mind, and Body in the Healing of Trauma',
            author: 'Bessel van der Kolk, M.D.',
            description:
                'A groundbreaking work exploring how trauma reshapes the brain and body and offering innovative approaches to healing through both psychological insights and body‑based therapies.',
            price: 16.99,
            categories: ['non-fiction', 'psychology', 'health'],
            quantity: 10,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg',
            pageCount: 464,
            printType: 'Paperback',
            publisher: 'Penguin Books',
            publishedDate: new Date('2015-09-08'),
        },
        {
            isbn: '9780060850524',
            title: 'Brave New World',
            author: 'Aldous Huxley',
            description:
                'A dystopian classic that imagines a future world society shaped by advanced science, social engineering, and psychological manipulation. Huxley’s novel explores themes of freedom, conformity, consumerism, and what it means to be human.',
            price: 11.99,
            categories: ['fiction', 'classic', 'dystopian', 'science-fiction'],
            quantity: 8,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
            pageCount: 288,
            printType: 'Paperback',
            publisher: 'Harper Perennial Modern Classics',
            publishedDate: new Date('2006-10-17'),
        },
        {
            isbn: '9780316015844',
            title: 'Twilight',
            author: 'Stephenie Meyer',
            description:
                'Bella Swan’s life changes forever when she moves to Forks, Washington, where she meets the mysterious and alluring Edward Cullen. As their romance deepens, Bella discovers Edward’s dangerous secret and the risks of loving a vampire.',
            price: 10.99,
            categories: ['fiction', 'young-adult', 'romance', 'fantasy'],
            quantity: 25,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg',
            pageCount: 498,
            printType: 'Paperback',
            publisher: 'Little, Brown Books for Young Readers',
            publishedDate: new Date('2006-09-06'),
        },
        {
            isbn: '9780394800011',
            title: 'The Cat in the Hat',
            author: 'Dr. Seuss',
            description:
                'A classic children’s picture book in which a mischievous cat in a tall striped hat turns a dull, rainy afternoon into a fun and chaotic adventure for two siblings, showing them the joys of imagination and play.',
            price: 8.99,
            categories: ['children', 'fiction', 'picture-book'],
            quantity: 30,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780394800011-L.jpg',
            pageCount: 72,
            printType: 'Hardcover',
            publisher: 'Random House Books for Young Readers',
            publishedDate: new Date('1957-03-12'),
        },
        {
            isbn: '9781451673319',
            title: 'Fahrenheit 451',
            author: 'Ray Bradbury',
            description:
                'In a future society where books are outlawed and “firemen” burn any that are found, Guy Montag begins to question his role in suppressing knowledge. As he confronts the meaning of individuality and freedom, he must choose between conformity and the courage to think for himself.',
            price: 12.5,
            categories: ['fiction', 'science-fiction', 'dystopian', 'classic'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
            pageCount: 256,
            printType: 'Paperback',
            publisher: 'Simon & Schuster',
            publishedDate: new Date('2012-01-10'),
        },
        {
            isbn: '9780141439600',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            description:
                'A timeless romance that follows Elizabeth Bennet as she navigates issues of class, marriage, and morality in early 19th‑century England, especially in her complex relationship with the enigmatic Mr. Darcy.',
            price: 9.99,
            categories: ['fiction', 'classic', 'romance'],
            quantity: 18,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg',
            pageCount: 480,
            printType: 'Paperback',
            publisher: 'Penguin Classics',
            publishedDate: new Date('2002-12-31'),
        },
        {
            isbn: '9780618260300',
            title: 'The Hobbit, Or, There and Back Again',
            author: 'J.R.R. Tolkien',
            description:
                'Bilbo Baggins, a humble hobbit, is swept into an epic adventure when the wizard Gandalf and thirteen dwarves recruit him to help reclaim their homeland from the fearsome dragon Smaug. Along the way Bilbo discovers courage, cunning, and the value of home.',
            price: 13.99,
            categories: ['fiction', 'fantasy', 'classic', 'adventure'],
            quantity: 15,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780618260300-L.jpg',
            pageCount: 384,
            printType: 'Paperback',
            publisher: 'Clarion Books',
            publishedDate: new Date('2002-08-15'),
        },
        {
            isbn: '9780061120084',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            description:
                'Set in the American South during the 1930s, this Pulitzer Prize‑winning novel follows young Scout Finch as her father, Atticus Finch, defends a Black man wrongly accused of a terrible crime. It explores themes of racial injustice, moral courage, and empathy.',
            price: 12.5,
            categories: ['fiction', 'classic', 'historical'],
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
            title: 'The Road',
            author: 'Cormac McCarthy',
            description:
                'In a stark, post‑apocalyptic world, a father and his young son undertake a perilous journey through a burned America, struggling to survive while holding onto their humanity and hope amid devastation.',
            price: 15.0,
            categories: ['fiction', 'post-apocalyptic', 'literary'],
            quantity: 12,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg',
            pageCount: 304,
            printType: 'Paperback',
            publisher: 'Vintage',
            publishedDate: new Date('2007-03-28'),
        },
        {
            isbn: '9780140449266',
            title: 'The Count of Monte Cristo',
            author: 'Alexandre Dumas',
            description:
                'After being falsely imprisoned, Edmond Dantès escapes from the Château d’If and sets in motion an intricate plan of revenge against those who betrayed him. This epic adventure blends betrayal, intrigue, justice, and redemption in a sweeping tale across 19th‑century Europe.',
            price: 10.99,
            categories: ['fiction', 'classic', 'adventure', 'historical'],
            quantity: 20,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg',
            pageCount: 1312,
            printType: 'Paperback',
            publisher: 'Penguin Classics',
            publishedDate: new Date('2003-05-27'),
        },
        {
            isbn: '9780553386790',
            title: 'A Game of Thrones',
            author: 'George R.R. Martin',
            description:
                'In the war‑torn fantasy land of Westeros, noble families battle for power, honor, and survival as political intrigue, betrayal, and supernatural forces shape the fate of the Seven Kingdoms. The first book in the epic Song of Ice and Fire series.',
            price: 16.99,
            categories: ['fiction', 'fantasy', 'epic'],
            quantity: 25,
            isFeatured: true,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780553386790-L.jpg',
            pageCount: 720,
            printType: 'Paperback',
            publisher: 'Random House Worlds',
            publishedDate: new Date('2011-03-22'),
        },
        {
            isbn: '9781649374042',
            title: 'Fourth Wing',
            author: 'Rebecca Yarros',
            description:
                'In a fantasy world where dragon riders are trained at the brutal Basgiath War College, Violet Sorrengail must prove herself in perilous trials, forge unlikely alliances, and confront dangers both political and supernatural as she fights to survive and uncover hidden truths.',
            price: 17.99,
            categories: ['fiction', 'fantasy', 'romance', 'young-adult'],
            quantity: 12,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg',
            pageCount: 528,
            printType: 'Hardcover',
            publisher: 'Entangled: Red Tower Books',
            publishedDate: new Date('2023-05-02'),
        },
        {
            isbn: '9781590385814',
            title: 'Fablehaven: Volume 1',
            author: 'Brandon Mull',
            description:
                'At his grandparents’ estate, young siblings Kendra and Seth discover a hidden sanctuary for magical creatures. When ancient laws are broken and a powerful evil is unleashed, they must summon all their courage to save Fablehaven and perhaps the world.',
            price: 19.99,
            categories: ['fiction', 'fantasy', 'children', 'middle-grade'],
            quantity: 15,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9781590385814-L.jpg',
            pageCount: 368,
            printType: 'Hardcover',
            publisher: 'Shadow Mountain',
            publishedDate: new Date('2006-06-07'),
        },
        {
            isbn: '9780064431781',
            title: 'Where the Wild Things Are',
            author: 'Maurice Sendak',
            description:
                'A beloved children’s picture book in which young Max, sent to his room without supper, imagines sailing away to a land of wild creatures and being crowned their king, only to return home where he is loved best of all.',
            price: 8.99,
            categories: ['children', 'fiction', 'picture-book'],
            quantity: 30,
            isFeatured: false,
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780064431781-L.jpg',
            pageCount: 48,
            printType: 'Paperback',
            publisher: 'HarperCollins',
            publishedDate: new Date('1984-01-01'),
        },
    ];

    const createdBooks = [];
    for (const b of books) {
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
                slug,
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
        for (const catSlug of b.categories) {
            const category = categories[catSlug];

            if (!category) {
                throw new Error(`Category not found for slug: ${catSlug}`);
            }

            await prisma.bookCategory.deleteMany({
                where: { bookId: book.id },
            });

            await prisma.bookCategory.create({
                data: { bookId: book.id, categoryId: category.id },
            });
        }

        createdBooks.push(book);
    }

    // --- ORDERS ---
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
