import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User, { IUser } from "@/models/User";
import DashboardForm from "./DashboardForm";
import { SocialLink } from "./LinkSettings";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user: IUser = await User.findById(session.user.id);

  const links = user.socialLinks.map((link: SocialLink) => ({
    platform: link.platform,
    username: link.username,
  }));
  const projects = user.projects.map((project) => ({
    id: project.id.toString(),
    name: project.name,
    description: project.description,
    link: project.link,
    logo: project.logo,
    stack: project.stack.map((stack) => ({
      name: stack.name,
      logo: stack.logo,
      link: stack.link,
    })),
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
        serverProjects={projects ?? []}
      />
    </>
  );
}
