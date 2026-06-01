import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }) {
  // Get auth credentials securely on the server
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  // Get user details to verify email
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Strict email check
  if (!adminEmail || email !== adminEmail) {
    redirect("/");
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
