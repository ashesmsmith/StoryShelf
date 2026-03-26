import Image from "next/image";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  coverImageUrl?: string | null;
  isFeatured: boolean;
};

const categories: Category[] = [
  { id: 1, name: "Fiction", slug: "fiction" },
  { id: 2, name: "Romance", slug: "romance" },
  { id: 3, name: "Mystery", slug: "mystery" },
  { id: 4, name: "Fantasy", slug: "fantasy" },
  { id: 5, name: "Self-Help", slug: "self-help" },
  { id: 6, name: "Children", slug: "children" },
];

const featuredBooks: Book[] = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 18.99,
    stockQuantity: 12,
    categoryId: 3,
    coverImageUrl: null,
    isFeatured: true,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 21.5,
    stockQuantity: 8,
    categoryId: 5,
    coverImageUrl: null,
    isFeatured: true,
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 19.25,
    stockQuantity: 15,
    categoryId: 1,
    coverImageUrl: null,
    isFeatured: true,
  },
  {
    id: 4,
    title: "It Ends With Us",
    author: "Colleen Hoover",
    price: 16.75,
    stockQuantity: 6,
    categoryId: 2,
    coverImageUrl: null,
    isFeatured: true,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getCategoryName(categoryId: number) {
  const category = categories.find((item) => item.id === categoryId);
  return category?.name ?? "Uncategorized";
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f5f2] text-[#2f3e46]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="StoryShelf logo"
            width={180}
            height={60}
            priority
          />
        </div>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#categories" className="transition hover:text-[#52796f]">
            Categories
          </a>
          <a href="#featured" className="transition hover:text-[#52796f]">
            Featured
          </a>
          <a href="#about" className="transition hover:text-[#52796f]">
            About
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-[#354f52] px-5 py-2.5 text-sm font-semibold text-[#354f52] transition hover:bg-[#354f52] hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#2f3e46] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create Account
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
              Inventory Tracking & E-Commerce
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight md:text-6xl">
              Your bookstore,
              <span className="block text-[#52796f]">organized and online.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52796f]">
              Manage inventory, showcase books, and create a smooth shopping
              experience for customers in one modern platform.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/books"
                className="rounded-full bg-[#2f3e46] px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                Browse Books
              </Link>
              <Link
                href="/employee/login"
                className="rounded-full border border-[#354f52] px-6 py-3 text-center font-semibold text-[#354f52] transition hover:bg-[#354f52] hover:text-white"
              >
                Employee Login
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#cad2c5] bg-white p-4 shadow-sm">
                <p className="font-semibold text-[#2f3e46]">Structured Data</p>
                <p className="mt-1 text-sm text-[#52796f]">
                  Books, categories, inventory and orders
                </p>
              </div>
              <div className="rounded-2xl border border-[#cad2c5] bg-white p-4 shadow-sm">
                <p className="font-semibold text-[#2f3e46]">Easy Search</p>
                <p className="mt-1 text-sm text-[#52796f]">
                  Find books by title, author or category
                </p>
              </div>
              <div className="rounded-2xl border border-[#cad2c5] bg-white p-4 shadow-sm">
                <p className="font-semibold text-[#2f3e46]">Stock Control</p>
                <p className="mt-1 text-sm text-[#52796f]">
                  Keep inventory synced with storefront
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-lg">
            <div className="rounded-2xl bg-[#edf1eb] p-5">
              <p className="text-sm font-semibold text-[#354f52]">
                Quick Search
              </p>

              <form
                action="/books"
                method="GET"
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search by title, author, or ISBN"
                  className="w-full rounded-xl border border-[#cad2c5] bg-white px-4 py-3 outline-none transition focus:border-[#52796f]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#52796f] px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="mt-5 rounded-2xl bg-[#2f3e46] p-6 text-white">
              <h2 className="text-xl font-semibold">
                     Structured Data Model
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-white/90">
                <li>Books, users, and inventory are structured using relational models.</li>
                <li>Each book is linked to categories, stock is tracked through quantity fields,</li>
                <li>and pricing is stored as numeric values to support accurate calculations and reporting.</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="categories"
          className="mx-auto max-w-7xl px-6 py-8 md:py-14"
        >
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
              Categories
            </span>
            <h2 className="mt-4 text-3xl font-bold">Explore by genre</h2>
            <p className="mt-2 text-[#52796f]">
              Each category can later come from the PostgreSQL table
              <span className="font-semibold"> categories</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/books?category=${category.slug}`}
                className="rounded-2xl border border-[#cad2c5] bg-white px-4 py-6 text-center font-semibold shadow-sm transition hover:-translate-y-1 hover:bg-[#84A98C] hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <section
          id="featured"
          className="mx-auto max-w-7xl px-6 py-8 md:py-14"
        >
          <div className="mb-8">
            <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
              Featured Books
            </span>
            <h2 className="mt-4 text-3xl font-bold">Popular picks this week</h2>
            <p className="mt-2 text-[#52796f]">
              Mock data now, easy to replace later with data from
              <span className="font-semibold"> /api/books</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredBooks.map((book) => (
              <article
                key={book.id}
                className="overflow-hidden rounded-3xl border border-[#cad2c5] bg-white shadow-sm"
              >
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#84A98C] to-[#354F52] text-lg font-semibold text-white">
                  {book.coverImageUrl ? (
                    <Image
                      src={book.coverImageUrl}
                      alt={book.title}
                      width={220}
                      height={220}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>Book Cover</span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-sm font-medium text-[#52796f]">
                    {getCategoryName(book.categoryId)}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-[#2f3e46]">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-[#52796f]">{book.author}</p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[#354f52]">
                      Stock: {book.stockQuantity}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 font-medium ${
                        book.stockQuantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.stockQuantity > 0 ? "Available" : "Out of stock"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-bold text-[#354f52]">
                      {formatPrice(book.price)}
                    </span>

                    <button className="rounded-xl bg-[#2f3e46] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3 md:py-14"
        >
          <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#2f3e46]">Books</h3>
            <p className="mt-3 leading-7 text-[#52796f]">
              Main catalog table with title, author, price, stock, image and
              category relation.
            </p>
          </div>

          <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#2f3e46]">Categories</h3>
            <p className="mt-3 leading-7 text-[#52796f]">
              Separate table for categories, linked to books through foreign
              keys.
            </p>
          </div>

          <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#2f3e46]">Orders</h3>
            <p className="mt-3 leading-7 text-[#52796f]">
              Prepared for relational order flow with users, orders and
              order_items.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 md:py-14">
          <div className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#84A98C] to-[#52796f] p-8 text-white md:flex-row md:items-center">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                Get Started
              </span>
              <h2 className="mt-4 text-3xl font-bold">
                Frontend aligned with PostgreSQL
              </h2>
              <p className="mt-2 max-w-2xl text-white/90">
                This structure is ready to evolve from local mock data to real
                API data.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/books"
                className="rounded-full bg-white px-6 py-3 text-center font-semibold text-[#2f3e46]"
              >
                Shop Now
              </Link>
              <Link
                href="/employee/login"
                className="rounded-full border border-white px-6 py-3 text-center font-semibold text-white"
              >
                Staff Access
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[#52796f] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-[#2f3e46]">StoryShelf</p>
          <p>Inventory Tracking & E-Commerce</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/books" className="hover:text-[#2f3e46]">
            Books
          </Link>
          <Link href="/login" className="hover:text-[#2f3e46]">
            Login
          </Link>
          <Link href="/register" className="hover:text-[#2f3e46]">
            Register
          </Link>
          <Link href="/employee/login" className="hover:text-[#2f3e46]">
            Employee Area
          </Link>
        </div>
      </footer>
    </div>
  );
}
