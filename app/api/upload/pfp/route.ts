import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/libs/s3";
import { IUser } from "@/models/User";
import { ensureAuthorized } from "@/lib/server-api";

async function uploadFileToS3(user: IUser, buffer: Buffer, fileName: string) {
  const fileBuffer = buffer;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${user.id}/${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  const response = await s3.send(command);
  if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode !== 200) {
    throw new Error("Failed to upload avatar!");
  }

  const image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${user.id}/profile.jpg`;
  user.customImage = image;
  await user.save();

  return image;
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const { response = null, session, user } = await ensureAuthorized({ session: true, user: true });
  if (response) {
    return response;
  }

  try {
    const formData = await req.formData();
    const pfpFile = formData.get("pfp") as File;
    if (!pfpFile) return NextResponse.json({ error: "Profile picture not received!" }, { status: 500 });
    if (!pfpFile.type.startsWith("image/"))
      return NextResponse.json({ error: "Profile picture must be an image" }, { status: 400 });
    if (pfpFile.size > 2 * 1024 * 1024)
      return NextResponse.json({ error: "Profile picture must be less than 2MB" }, { status: 400 });

    const buffer = Buffer.from(await pfpFile.arrayBuffer());
    await uploadFileToS3(user, buffer, `profile.jpg`);

    return NextResponse.json({
      success: true,
      image: (user.customImage || user.image) ?? "",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
