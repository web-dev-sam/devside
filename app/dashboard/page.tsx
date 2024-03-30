import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import DashboardForm from "./DashboardForm";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  return (
    <>
      <DashboardForm
        userName={user.name ?? ""}
        role={user.role ?? ""}
        location={user.location ?? ""}
        bio={user.bio ?? ""}
        pfp={(user.customImage || user.image) ?? ""}
      />
    </>
  );
}
