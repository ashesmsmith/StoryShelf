import BooksClient from './BooksClient';

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const params = await searchParams;

    return <BooksClient initialQuery={params.search} />;
}