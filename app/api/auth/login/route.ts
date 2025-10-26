import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { STATUS_CODES, MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse(MESSAGES.EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return errorResponse(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return successResponse(MESSAGES.LOGIN_SUCCESS, {
      token,
      user: { id: user.id, name: user.name, email: user.email }
    }, STATUS_CODES.OK);
  } catch (error) {
    return errorResponse(MESSAGES.LOGIN_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}
