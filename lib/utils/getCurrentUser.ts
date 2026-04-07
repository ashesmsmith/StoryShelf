import { cookies } from 'next/headers';

type SessionUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) return null;

    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
}
