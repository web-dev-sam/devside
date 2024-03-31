import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import User, { type IUser } from "@/models/User";

export async function ensureAuthorized({ session = true, user = true }: { session: boolean; user: boolean }): Promise<{
  session: Session | null;
  response?: NextResponse;
  user?: IUser | null;
}> {
  const serverSession = await getServerSession(authOptions);
  if (session && (!serverSession || !serverSession?.user)) {
    return {
      session: serverSession,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (user) {
    const userId = serverSession.user.id;
    const userObj = await User.findById(userId);
    if (!userObj) {
      return {
        session: serverSession,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        user: null,
      };
    } else {
      return { 
        session: serverSession,
        user: userObj,
      };
    }
  }

  return { session: serverSession };
}
