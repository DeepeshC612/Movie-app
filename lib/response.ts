import { NextResponse } from 'next/server';

interface ApiResponse<T = any> {
  message: string;
  status: boolean;
  result?: T;
}

export function successResponse<T>(message: string, result?: T, statusCode = 200) {
  const response: ApiResponse<T> = {
    message,
    status: true,
    result
  };
  return NextResponse.json(response, { status: statusCode });
}

export function errorResponse(message: string, statusCode = 400) {
  const response: ApiResponse = {
    message,
    status: false
  };
  return NextResponse.json(response, { status: statusCode });
}
