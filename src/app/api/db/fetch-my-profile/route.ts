import { userProfileMeDto } from "@/app/_dto/fetch-profile/Profile.dto";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../functions/web/verify-jwt";
import { sendApiError } from "@/utils/apiErrorResponse/sendApiError";

export async function GET(req: NextRequest) {
  const prisma = new PrismaClient();
  const token = req.cookies.get("jwtToken")?.value;

  try {
    if (!token) {
      return sendApiError(401, "No Auth Token");
    }
    let handle: string;
    try {
      handle = (await verifyToken(token)).handle;
    } catch {
      return sendApiError(401, "Token Verify Error");
    }

    const userProfile = await prisma.profile.findUnique({
      include: {
          user: {
            select: {hostName: true}
          },
      },
      where: {
        handle: handle,
      },
    });
    if (!userProfile) {
      return NextResponse.json({ message: `User not found` }, { status: 404 });
    }
    const host = userProfile.user.hostName;
    const { instanceType } = await prisma.server.findUniqueOrThrow({where: {instances: host}, select: {instanceType: true}});

    const questionCount = await prisma.profile.findUnique({
      where: {
        handle: handle,
      },
      select: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
    const res: userProfileMeDto = {
      handle: userProfile.handle,
      name: userProfile.name,
      stopNewQuestion: userProfile.stopNewQuestion,
      stopAnonQuestion: userProfile.stopAnonQuestion,
      avatarUrl: userProfile.avatarUrl,
      questionBoxName: userProfile.questionBoxName,
      stopNotiNewQuestion: userProfile.stopNotiNewQuestion,
      stopPostAnswer: userProfile.stopPostAnswer,
      questions: questionCount ? questionCount._count.questions : null,
      instanceType: instanceType,
    };

    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      { message: `Bad Request: ${err}` },
      { status: 400 }
    );
  }
}
