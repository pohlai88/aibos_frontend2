import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Import types from the main route file
export interface JournalEntry {
  id: string;
  tenantId: string;
  date: string;
  description: string;
  lines: JournalLine[];
  reference?: string;
  status: 'draft' | 'pending' | 'posted' | 'voided';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  postingDate?: string;
  totalDebit: number;
  totalCredit: number;
}

export interface JournalLine {
  id: string;
  account: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface UpdateJournalEntryRequest {
  date?: string;
  description?: string;
  lines?: Omit<JournalLine, 'id'>[];
  reference?: string;
  status?: 'draft' | 'pending' | 'posted' | 'voided';
}

// Mock storage - shared with main route (in production, use database)
// Note: This should ideally be in a shared module/service
const mockJournalEntries: JournalEntry[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

// Utility functions
function generateLineId(): string {
  return 'jl_' + Math.random().toString(36).substr(2, 9);
}

function validateDoubleEntry(lines: JournalLine[]): boolean {
  const totalDebits = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredits = lines.reduce((sum, line) => sum + line.credit, 0);
  
  // Check if debits equal credits (within floating point tolerance)
  return Math.abs(totalDebits - totalCredits) < 0.01;
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

// GET /api/journal/[id] - Get single journal entry
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = getAuthInfo(request);
    const { id } = await context.params;
    
    const entry = mockJournalEntries.find(e => e.id === id && e.tenantId === tenantId);
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(entry);

  } catch (error) {
    console.error('GET /api/journal/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entry', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/journal/[id] - Update journal entry
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = getAuthInfo(request);
    const { id } = await context.params;
    const body: UpdateJournalEntryRequest = await request.json();
    
    const entryIndex = mockJournalEntries.findIndex(e => e.id === id && e.tenantId === tenantId);
    
    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }
    
    const existingEntry = mockJournalEntries[entryIndex];
    
    // Prevent updates to posted entries
    if (existingEntry.status === 'posted') {
      return NextResponse.json(
        { error: 'Cannot modify posted journal entries' },
        { status: 400 }
      );
    }
    
    // Process lines if provided
    let updatedLines = existingEntry.lines;
    if (body.lines) {
      updatedLines = body.lines.map(line => ({
        ...line,
        id: generateLineId(),
      }));
      
      // Validate double-entry accounting
      if (!validateDoubleEntry(updatedLines)) {
        return NextResponse.json(
          { error: 'Invalid journal entry: debits must equal credits' },
          { status: 400 }
        );
      }
    }
    
    // Calculate totals
    const totalDebit = updatedLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = updatedLines.reduce((sum, line) => sum + line.credit, 0);
    
    // Update entry
    const updatedEntry: JournalEntry = {
      ...existingEntry,
      date: body.date || existingEntry.date,
      description: body.description || existingEntry.description,
      lines: updatedLines,
      reference: body.reference !== undefined ? body.reference : existingEntry.reference,
      status: body.status || existingEntry.status,
      updatedAt: new Date().toISOString(),
      totalDebit,
      totalCredit,
    };
    
    // Add posting date if status changed to posted
    if (body.status && body.status === 'posted' && (existingEntry.status as string) !== 'posted') {
      updatedEntry.postingDate = new Date().toISOString();
    }
    
    mockJournalEntries[entryIndex] = updatedEntry;
    
    return NextResponse.json(updatedEntry);

  } catch (error) {
    console.error('PUT /api/journal/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/journal/[id] - Delete journal entry
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = getAuthInfo(request);
    const { id } = await context.params;
    
    const entryIndex = mockJournalEntries.findIndex(e => e.id === id && e.tenantId === tenantId);
    
    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }
    
    const entry = mockJournalEntries[entryIndex];
    
    // Prevent deletion of posted entries
    if (entry.status === 'posted') {
      return NextResponse.json(
        { error: 'Cannot delete posted journal entries' },
        { status: 400 }
      );
    }
    
    // Remove entry
    mockJournalEntries.splice(entryIndex, 1);
    
    return NextResponse.json({
      message: 'Journal entry deleted successfully'
    });

  } catch (error) {
    console.error('DELETE /api/journal/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
