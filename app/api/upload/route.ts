import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import s3 from "@/libs/s3";
import User from "@/models/User";

async function uploadFileToS3<
  U extends {
    customImage: string;
    [key: string]: any;
  },
>(user: U, buffer: Buffer, fileName: string) {
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
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  user.name = formData.get("username") as string;
  user.role = formData.get("role") as string;
  user.location = formData.get("location") as string;
  user.bio = formData.get("bio") as string;
  user.save();

  try {
    const pfpFile = formData.get("pfp") as File;

    if (pfpFile) {
      if (!pfpFile.type.startsWith("image/")) {
        return NextResponse.json({ error: "Profile picture must be an image" }, { status: 400 });
      }

      if (pfpFile.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: "Profile picture must be less than 2MB" }, { status: 400 });
      }

      const buffer = Buffer.from(await pfpFile.arrayBuffer());
      try {
        await uploadFileToS3(user, buffer, `profile.jpg`);
      } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      image: (user.customImage || user.image) ?? "",
      role: user.role ?? "",
      location: user.location ?? "",
      bio: user.bio ?? "",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
