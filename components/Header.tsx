import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import { getCartCount } from '@/components/getCartCount';

export default async function Header() {
    const user = await getCurrentUser();

    let cartCount = 0;
    if (user) {
        cartCount = await getCartCount(user.id);
    }

    return (
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
            <Link href="/" scroll={false}>
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="StoryShelf logo"
                        width={180}
                        height={60}
                        priority
                    />
                </div>
            </Link>

            <nav className="hidden gap-8 text-sm font-medium md:flex">
                <Link href="/">Home</Link>
                <Link href="/#categories">Categories</Link>
                <Link href="/#featured">Featured</Link>
            </nav>

            <div className="hidden items-center gap-4 md:flex">
                <Link href="/cart" className="relative text-2xl">
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {user ? (
                    <>
                        <span className="text-sm text-[#52796f]">
                            Hi, {user.firstName}
                        </span>

                        <form action="/" method="POST">
                            <button className="rounded-full border px-4 py-2 text-sm">
                                Logout
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <Link href="/login">Sign In</Link>
                        <Link href="/register">Create Account</Link>
                    </>
                )}
            </div>
        </header>
    );
}