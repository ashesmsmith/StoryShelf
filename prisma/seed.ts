import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.bookCategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.book.deleteMany();

    // Create categories
    const categoryData = [
        { name: 'Fiction' },
        { name: 'Fantasy' },
        { name: 'Science Fiction' },
        { name: 'Mystery' },
        { name: 'Romance' },
        { name: 'Nonfiction' },
        { name: 'Biography' },
        { name: 'Self-Help' },
        { name: 'History' },
        { name: 'Young Adult' },
    ];

    for (const cat of categoryData) {
        await prisma.category.create({
            data: {
                name: cat.name,
                slug: slugify(cat.name),
            },
        });
    }

    const categories = await prisma.category.findMany();

    const getCategoryId = (name: string) => categories.find((c) => c.name === name)?.id;

    // Books (10 with full data)
    const books = [
        {
            isbn: '9780743273565',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            description: 'A novel set in the Jazz Age exploring wealth and identity.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
            price: 10.99,
            pageCount: 180,
            printType: 'BOOK',
            publisher: 'Scribner',
            publishedDate: new Date('2004-09-30'),
            category: 'Fiction',
        },
        {
            isbn: '9780439708180',
            title: "Harry Potter and the Sorcerer's Stone",
            author: 'J.K. Rowling',
            description: 'A young wizard begins his journey at Hogwarts.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
            price: 12.99,
            pageCount: 309,
            printType: 'BOOK',
            publisher: 'Scholastic',
            publishedDate: new Date('1998-09-01'),
            category: 'Fantasy',
        },
        {
            isbn: '9780544003415',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            description: 'Bilbo Baggins embarks on an unexpected journey.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg',
            price: 11.99,
            pageCount: 300,
            printType: 'BOOK',
            publisher: 'Houghton Mifflin',
            publishedDate: new Date('2012-09-18'),
            category: 'Fantasy',
        },
        {
            isbn: '9780441013593',
            title: 'Dune',
            author: 'Frank Herbert',
            description: 'A science fiction epic on the desert planet Arrakis.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg',
            price: 14.99,
            pageCount: 412,
            printType: 'BOOK',
            publisher: 'Ace',
            publishedDate: new Date('2005-08-02'),
            category: 'Science Fiction',
        },
        {
            isbn: '9780307474278',
            title: 'The Girl with the Dragon Tattoo',
            author: 'Stieg Larsson',
            description: 'A mystery involving a journalist and a hacker.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
            price: 13.99,
            pageCount: 465,
            printType: 'BOOK',
            publisher: 'Vintage Crime',
            publishedDate: new Date('2009-05-26'),
            category: 'Mystery',
        },
        {
            isbn: '9781501124020',
            title: 'It',
            author: 'Stephen King',
            description: 'A horror story of a shape-shifting entity.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg',
            price: 15.99,
            pageCount: 1138,
            printType: 'BOOK',
            publisher: 'Scribner',
            publishedDate: new Date('2016-01-05'),
            category: 'Fiction',
        },
        {
            isbn: '9781451648539',
            title: 'Steve Jobs',
            author: 'Walter Isaacson',
            description: 'Biography of Apple co-founder Steve Jobs.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg',
            price: 16.99,
            pageCount: 656,
            printType: 'BOOK',
            publisher: 'Simon & Schuster',
            publishedDate: new Date('2011-10-24'),
            category: 'Biography',
        },
        {
            isbn: '9780061120084',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            description: 'A story of racial injustice in the Deep South.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
            price: 9.99,
            pageCount: 336,
            printType: 'BOOK',
            publisher: 'Harper Perennial',
            publishedDate: new Date('2006-05-23'),
            category: 'Fiction',
        },
        {
            isbn: '9780553380163',
            title: 'A Game of Thrones',
            author: 'George R.R. Martin',
            description: 'Noble families vie for control of the Iron Throne.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg',
            price: 13.99,
            pageCount: 694,
            printType: 'BOOK',
            publisher: 'Bantam',
            publishedDate: new Date('2005-08-01'),
            category: 'Fantasy',
        },
        {
            isbn: '9780143127741',
            title: 'Sapiens',
            author: 'Yuval Noah Harari',
            description: 'A brief history of humankind.',
            imageURL: 'https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg',
            price: 18.99,
            pageCount: 498,
            printType: 'BOOK',
            publisher: 'Harper',
            publishedDate: new Date('2015-02-10'),
            category: 'Biography',
        },
    ];

    for (const book of books) {
        const createdBook = await prisma.book.create({
            data: {
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                description: book.description,
                imageURL: book.imageURL,
                price: book.price,
                slug: slugify(book.title),
                pageCount: book.pageCount,
                printType: book.printType,
                publisher: book.publisher,
                publishedDate: book.publishedDate,
                isFeatured: false,
            },
        });

        // Inventory
        await prisma.inventory.create({
            data: {
                bookId: createdBook.id,
                quantity: Math.floor(Math.random() * 20) + 5, // 5–25 stock
            },
        });

        // Category relation
        const categoryId = getCategoryId(book.category);

        if (categoryId) {
            await prisma.bookCategory.create({
                data: {
                    bookId: createdBook.id,
                    categoryId,
                },
            });
        }
    }

    console.log('✅ Seeded 10 books with full data + inventory');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
