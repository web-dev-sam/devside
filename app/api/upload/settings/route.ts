import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import { ensureAuthorized } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  await connectMongo();
  const { response = null, session, user } = await ensureAuthorized({ session: true, user: true });
  if (response) {
    return response;
  }

  const data = await req.json();

  if (data.username) user.name = data.username;
  if (data.role != null) user.role = data.role;
  if (data.location != null) user.location = data.location;
  if (data.bio != null) user.bio = data.bio;
  if (data.links) {
    user.socialLinks = data.links;
  }

  try {
    await user.save();
  } catch (error) {
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
  });
}
