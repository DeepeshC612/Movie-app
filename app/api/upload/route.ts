import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { STATUS_CODES, MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return errorResponse(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return errorResponse('No file uploaded', STATUS_CODES.BAD_REQUEST);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    // Write file to public/uploads directory
    await writeFile(path, buffer);

    return successResponse('File uploaded successfully', {
      filename,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Upload failed', STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}
