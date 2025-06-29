// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Types for feedback system
export interface Feedback {
  id: string;
  entryId: string;
  tenantId: string;
  comment: string;
  category: 'documentation' | 'compliance' | 'accuracy' | 'process' | 'other';
  actor: string;
  actorName?: string;
  createdAt: string;
  updatedAt: string;
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface CreateFeedbackRequest {
  entryId: string;
  comment: string;
  category: 'documentation' | 'compliance' | 'accuracy' | 'process' | 'other';
}

// Mock storage - in production, this would be a database
let mockFeedback: Feedback[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

// Utility functions
function generateId(): string {
  return 'fb_' + Math.random().toString(36).substr(2, 9);
}

function getAuthInfo(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  
  return {
    userId: decoded.sub,
    email: decoded.email,
    role: decoded.role,
    tenantId: decoded.tenantId,
  };
}

function seedMockFeedback(tenantId: string) {
  // Only seed if no feedback exists for this tenant
  const existingFeedback = mockFeedback.filter(f => f.tenantId === tenantId);
  if (existingFeedback.length > 0) return;

  const mockFeedbackEntries: Feedback[] = [
    {
      id: generateId(),
      entryId: 'je_001', // This should match an actual journal entry ID
      tenantId,
      comment: 'Please provide the original invoice for this expense',
      category: 'documentation',
      actor: 'auditor@company.com',
      actorName: 'Sarah Johnson',
      createdAt: '2024-12-10T14:30:00Z',
      updatedAt: '2024-12-10T14:30:00Z',
      resolved: false,
    },
    {
      id: generateId(),
      entryId: 'je_002',
      tenantId,
      comment: 'This entry looks correct, but consider adding more detail in the description',
      category: 'process',
      actor: 'manager@company.com',
      actorName: 'Mike Chen',
      createdAt: '2024-12-11T09:15:00Z',
      updatedAt: '2024-12-11T09:15:00Z',
      resolved: true,
      resolvedBy: 'bookkeeper@company.com',
      resolvedAt: '2024-12-11T16:20:00Z',
    },
  ];

  mockFeedback.push(...mockFeedbackEntries);
}

// GET /api/feedback - List feedback entries
export async function GET(request: NextRequest) {
  try {
    const { tenantId } = getAuthInfo(request);
    
    // Seed mock data for demo
    seedMockFeedback(tenantId);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');
    const resolved = searchParams.get('resolved');
    
    // Filter by tenant
    let filteredFeedback = mockFeedback.filter(feedback => feedback.tenantId === tenantId);
    
    // Filter by entryId if provided
    if (entryId) {
      filteredFeedback = filteredFeedback.filter(feedback => feedback.entryId === entryId);
    }
    
    // Filter by resolved status if provided
    if (resolved !== null) {
      const isResolved = resolved === 'true';
      filteredFeedback = filteredFeedback.filter(feedback => !!feedback.resolved === isResolved);
    }
    
    // Sort by most recent first
    filteredFeedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      feedback: filteredFeedback,
      count: filteredFeedback.length,
    });
    
  } catch (error) {
    console.error('GET /api/feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/feedback - Create new feedback entry
export async function POST(request: NextRequest) {
  try {
    const { userId, email, tenantId } = getAuthInfo(request);
    const body: CreateFeedbackRequest = await request.json();
    
    // Validate required fields
    if (!body.entryId || !body.comment || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: entryId, comment, and category are required' },
        { status: 400 }
      );
    }
    
    // Validate category
    const validCategories = ['documentation', 'compliance', 'accuracy', 'process', 'other'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: ' + validCategories.join(', ') },
        { status: 400 }
      );
    }
    
    // TODO: In production, validate that entryId exists and belongs to tenant
    
    // Create new feedback entry
    const newFeedback: Feedback = {
      id: generateId(),
      entryId: body.entryId,
      tenantId,
      comment: body.comment.trim(),
      category: body.category,
      actor: email,
      actorName: email.split('@')[0], // Simple name extraction
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolved: false,
    };
    
    mockFeedback.push(newFeedback);
    
    return NextResponse.json(newFeedback, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
