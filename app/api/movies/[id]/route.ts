import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { STATUS_CODES, MESSAGES } from '@/lib/constants';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return errorResponse(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const { title, publishingYear, poster } = await request.json();
    const { id } = await params;
    const movieId = parseInt(id);

    if (!title || !publishingYear) {
      return errorResponse(MESSAGES.TITLE_YEAR_REQUIRED, STATUS_CODES.BAD_REQUEST);
    }

    const movie = await prisma.movie.updateMany({
      where: { 
        id: movieId, 
        userId: user.userId 
      },
      data: {
        title,
        publishingYear: parseInt(publishingYear),
        poster
      }
    });

    if (movie.count === 0) {
      return errorResponse(MESSAGES.MOVIE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return successResponse(MESSAGES.MOVIE_UPDATED, undefined, STATUS_CODES.OK);
  } catch (error) {
    console.error('Update error:', error);
    return errorResponse(MESSAGES.MOVIE_UPDATE_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return errorResponse(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const { id } = await params;
    const movieId = parseInt(id);

    const movie = await prisma.movie.deleteMany({
      where: { id: movieId, userId: user.userId }
    });

    if (movie.count === 0) {
      return errorResponse(MESSAGES.MOVIE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return successResponse(MESSAGES.MOVIE_DELETED, undefined, STATUS_CODES.OK);
  } catch (error) {
    return errorResponse(MESSAGES.MOVIE_DELETE_FAILED, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}
