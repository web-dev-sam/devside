import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
}
