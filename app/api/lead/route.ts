import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { sendEmail } from "@/libs/mailgun";
import config from "@/config";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
// Duplicate emails just return 200 OK
export async function POST(req: NextRequest) {
  await connectMongo();

  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // await Lead.deleteOne({ email: body.email })
    const lead = await Lead.findOne({ email: body.email });

    if (!lead) {
      await Lead.create({ email: body.email });

      await sendEmail({
        to: body.email,
        subject: "Thanks for signing up!",
        text: "We'll keep you updated with the latest news.",
        html: "We'll keep you updated with the latest news.",
        replyTo: config.mailgun.fromAdmin,
      })
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
