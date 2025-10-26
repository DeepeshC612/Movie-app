import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/response';
import { STATUS_CODES, MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return errorResponse(MESSAGES.NAME_EMAIL_PASSWORD_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return errorResponse(MESSAGES.USER_EXISTS, STATUS_CODES.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return successResponse(MESSAGES.REGISTRATION_SUCCESS, {
      user: { id: user.id, name: user.name, email: user.email }
    }, STATUS_CODES.CREATED);
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(MESSAGES.REGISTRATION_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}
