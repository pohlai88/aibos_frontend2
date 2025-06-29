import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database
const MOCK_USERS = [
  {
    id: 'user-123',
    email: 'wee@ledgeros.com',
    password: 'demo123', // In real app, this would be hashed
    name: 'Wee Auditor',
    role: 'reviewer' as const,
    tenantId: 'tenant-demo-123',
  },
  {
    id: 'admin-456',
    email: 'admin@ledgeros.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    tenantId: 'tenant-demo-123',
  },
  {
    id: 'engineer-789',
    email: 'engineer@ledgeros.com',
    password: 'eng123',
    name: 'John Engineer',
    role: 'engineer' as const,
    tenantId: 'tenant-demo-123',
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60), // 8 hours
      },
      JWT_SECRET,
      { algorithm: 'HS256' }
    );

    // Return success response
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
