import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'employee' | 'management';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

export async function requireManagementAuth(): Promise<JWTPayload> {
  const user = await requireAuth();
  
  if (user.role !== 'management') {
    throw new Error('Management access required');
  }

  return user;
}