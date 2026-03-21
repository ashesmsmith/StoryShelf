"use server";

export async function fetchGoogleBook(query: string) {
    const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`,
        { cache: "no-store" }
    );

    const data = await res.json();

    const book = data.items?.[0]?.volumeInfo;

    if (!book) return null;

    return {
        title: book.title || "",
        author: book.authors?.[0] || "",
        description: book.description || "",
        image: book.imageLinks?.thumbnail || "",
    };
}

export async function createBook(formData: FormData) {
    const title = String(formData.get("title"));
    const author = String(formData.get("author"));
    const price = Number(formData.get("price"));
    const stockQuantity = Number(formData.get("stockQuantity"));

    console.log("Creating book:", { title, author, price, stockQuantity });
}