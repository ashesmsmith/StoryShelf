import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = (await cookies()).get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  let user;

  try {
    user = JSON.parse(session);
  } catch {
    redirect("/login");
  }

  if (user.role !== "employee") {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
    </div>
  );
}