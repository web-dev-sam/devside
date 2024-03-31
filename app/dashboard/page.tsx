import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import DashboardForm from "./DashboardForm";
import { SocialLink } from "./LinkSettings";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  const links = user.socialLinks.map((link: SocialLink) => ({
    platform: link.platform,
    username: link.username,
  }));

  return (
    <>
      <DashboardForm
        serverUserName={user.name ?? ""}
        serverRole={user.role ?? ""}
        serverLocation={user.location ?? ""}
        serverBio={user.bio ?? ""}
        serverPfp={(user.customImage || user.image) ?? ""}
        serverSocialLinks={links ?? []}
      />
    </>
  );
}
