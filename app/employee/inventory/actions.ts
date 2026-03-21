"use server";

export async function updateInventory(formData: FormData) {
    const id = Number(formData.get("id"));
    const stockQuantity = Number(formData.get("stockQuantity"));

  // 🧪 Replace with Prisma later
    console.log("Updating book:", { id, stockQuantity });
}