export function generateSlug(title: string, isbn: string) {
    const cleanTitle = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');

    return `${cleanTitle}-${isbn}`;
}
