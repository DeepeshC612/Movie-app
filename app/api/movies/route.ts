import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { STATUS_CODES, MESSAGES } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return errorResponse(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
      prisma.movie.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.movie.count({
        where: { userId: user.userId }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return successResponse(MESSAGES.MOVIES_RETRIEVED, {
      movies,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, STATUS_CODES.OK);
  } catch (error) {
    return errorResponse(MESSAGES.MOVIES_FETCH_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return errorResponse(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const { title, publishingYear, poster } = await request.json();

    if (!title || !publishingYear) {
      return errorResponse(MESSAGES.TITLE_YEAR_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        publishingYear: parseInt(publishingYear),
        poster,
        userId: user.userId
      }
    });

    return successResponse(MESSAGES.MOVIE_CREATED, { movie }, STATUS_CODES.CREATED);
  } catch (error) {
    return errorResponse(MESSAGES.MOVIE_CREATE_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}
