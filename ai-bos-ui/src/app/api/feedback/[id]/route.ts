// src/app/api/feedback/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import types from the main feedback route
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

export interface UpdateFeedbackRequest {
  comment?: string;
  category?: 'documentation' | 'compliance' | 'accuracy' | 'process' | 'other';
  resolved?: boolean;
}

// Mock storage - shared with main route (in production, use database)
let mockFeedback: Feedback[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

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

// GET /api/feedback/[id] - Get single feedback entry
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = getAuthInfo(request);
    const { id } = await context.params;
    
    const feedback = mockFeedback.find(f => f.id === id && f.tenantId === tenantId);
    
    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(feedback);
    
  } catch (error) {
    console.error('GET /api/feedback/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/feedback/[id] - Update feedback entry
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { email, tenantId } = getAuthInfo(request);
    const { id } = await context.params;
    const body: UpdateFeedbackRequest = await request.json();
    
    const feedbackIndex = mockFeedback.findIndex(f => f.id === id && f.tenantId === tenantId);
    
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }
    
    const existingFeedback = mockFeedback[feedbackIndex];
    
    // Update feedback entry
    const updatedFeedback: Feedback = {
      ...existingFeedback,
      comment: body.comment !== undefined ? body.comment.trim() : existingFeedback.comment,
      category: body.category || existingFeedback.category,
      updatedAt: new Date().toISOString(),
    };
    
    // Handle resolved status change
    if (body.resolved !== undefined) {
      if (body.resolved && !existingFeedback.resolved) {
        // Mark as resolved
        updatedFeedback.resolved = true;
        updatedFeedback.resolvedBy = email;
        updatedFeedback.resolvedAt = new Date().toISOString();
      } else if (!body.resolved && existingFeedback.resolved) {
        // Mark as unresolved
        updatedFeedback.resolved = false;
        updatedFeedback.resolvedBy = undefined;
        updatedFeedback.resolvedAt = undefined;
      }
    }
    
    mockFeedback[feedbackIndex] = updatedFeedback;
    
    return NextResponse.json(updatedFeedback);
    
  } catch (error) {
    console.error('PUT /api/feedback/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback/[id] - Delete feedback entry
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = getAuthInfo(request);
    const { id } = await context.params;
    
    const feedbackIndex = mockFeedback.findIndex(f => f.id === id && f.tenantId === tenantId);
    
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }
    
    // Remove feedback entry
    mockFeedback.splice(feedbackIndex, 1);
    
    return NextResponse.json({
      message: 'Feedback deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/feedback/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete feedback', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
