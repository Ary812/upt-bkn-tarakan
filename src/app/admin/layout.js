import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }) {
  const { userId } = await auth();
  
  // If no user is logged in, Clerk middleware should have caught this,
  // but we check again just in case.
  if (!userId) {
    redirect("/login");
  }

  // Fetch the user's details from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  // Compare with our secure server-side env variable
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (adminEmail && userEmail !== adminEmail) {
    // If unauthorized, redirect them to the home page
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
