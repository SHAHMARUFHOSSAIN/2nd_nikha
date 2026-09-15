import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Role } from '@prisma/client';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || 'insecure-default-secret-change-in-production';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const TOKEN_KEY = '2ndnikah_session';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (!payload.id || !payload.role) return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(TOKEN_KEY)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionUser | null> {
  return getSession();
}

export async function setSessionCookie(response: NextResponse, token: string): Promise<void> {
  response.cookies.set({
    name: TOKEN_KEY,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: TOKEN_KEY,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(TOKEN_KEY)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function isAdmin(user: SessionUser | null): boolean {
  return !!user && user.role === 'ADMIN';
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export async function getSessionUserFromDb(userId: string) {
  try {
    return await db.user.findUnique({ where: { id: userId }, include: { profile: true } });
  } catch {
    return null;
  }
}