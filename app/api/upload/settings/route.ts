import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import { ensureAuthorized } from "@/lib/server-api";
import { UserSettingsData, validateUserSettings } from "@/lib/api";

export async function POST(req: NextRequest) {
  await connectMongo();
  const { response = null, session, user } = await ensureAuthorized({ session: true, user: true });
  if (response) {
    return response;
  }

  const data = (await req.json()) as Partial<UserSettingsData>;
  const isValid = validateUserSettings(data);
  if (!isValid.valid) {
    return NextResponse.json({ error: isValid.message }, { status: 400 });
  }

  if (data.username) user.name = data.username;
  if (data.role != null) user.role = data.role;
  if (data.location != null) user.location = data.location;
  if (data.bio != null) user.bio = data.bio;
  if (JSON.stringify(data.links) !== JSON.stringify(user.socialLinks)) {
    user.socialLinks = data.links;
  }
  if (JSON.stringify(data.projects) !== JSON.stringify(user.projects)) {
    // Let mongoose handle the id
    user.projects = data.projects.map((project) => ({
      ...project,
      logo: ""
    }));
  }

  try {
    await user.save();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while saving your settings" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
  });
}
