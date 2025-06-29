import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Types for proper double-entry journal system
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

export interface CreateJournalEntryRequest {
  date: string;
  description: string;
  lines: Omit<JournalLine, 'id'>[];
  reference?: string;
  status?: 'draft' | 'pending';
}

// Mock storage - in production, this would be a database
const mockJournalEntries: JournalEntry[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

// Utility functions
function generateId(): string {
  return 'je_' + Math.random().toString(36).substr(2, 9);
}

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

function seedMockData(tenantId: string) {
  // Only seed if no entries exist for this tenant
  const existingEntries = mockJournalEntries.filter(e => e.tenantId === tenantId);
  if (existingEntries.length > 0) return;

  const mockEntries: JournalEntry[] = [
    {
      id: generateId(),
      tenantId,
      date: '2024-12-10',
      description: 'Office equipment purchase',
      lines: [
        {
          id: generateLineId(),
          account: 'Office Equipment',
          debit: 1500,
          credit: 0,
          description: 'Computer and desk setup'
        },
        {
          id: generateLineId(),
          account: 'Cash',
          debit: 0,
          credit: 1500,
          description: 'Payment for office equipment'
        }
      ],
      reference: 'INV-2024-001',
      status: 'posted',
      createdBy: 'admin@company.com',
      createdAt: '2024-12-10T09:00:00Z',
      updatedAt: '2024-12-10T09:00:00Z',
      postingDate: '2024-12-10T09:00:00Z',
      totalDebit: 1500,
      totalCredit: 1500,
    },
    {
      id: generateId(),
      tenantId,
      date: '2024-12-11',
      description: 'Monthly rent payment',
      lines: [
        {
          id: generateLineId(),
          account: 'Rent Expense',
          debit: 2500,
          credit: 0,
          description: 'Office rent for December'
        },
        {
          id: generateLineId(),
          account: 'Bank Account',
          debit: 0,
          credit: 2500,
          description: 'Rent payment via bank transfer'
        }
      ],
      reference: 'RENT-2024-12',
      status: 'posted',
      createdBy: 'admin@company.com',
      createdAt: '2024-12-11T10:30:00Z',
      updatedAt: '2024-12-11T10:30:00Z',
      postingDate: '2024-12-11T10:30:00Z',
      totalDebit: 2500,
      totalCredit: 2500,
    },
    {
      id: generateId(),
      tenantId,
      date: '2024-12-15',
      description: 'Software license purchase',
      lines: [
        {
          id: generateLineId(),
          account: 'Software Expense',
          debit: 299,
          credit: 0,
          description: 'Annual subscription'
        },
        {
          id: generateLineId(),
          account: 'Credit Card',
          debit: 0,
          credit: 299,
          description: 'Payment via corporate card'
        }
      ],
      reference: 'SUB-2024-003',
      status: 'draft',
      createdBy: 'bookkeeper@company.com',
      createdAt: '2024-12-15T14:20:00Z',
      updatedAt: '2024-12-15T14:20:00Z',
      totalDebit: 299,
      totalCredit: 299,
    },
    {
      id: generateId(),
      tenantId,
      date: '2024-12-16',
      description: 'Customer payment received',
      lines: [
        {
          id: generateLineId(),
          account: 'Bank Account',
          debit: 5000,
          credit: 0,
          description: 'Payment from ABC Corp'
        },
        {
          id: generateLineId(),
          account: 'Accounts Receivable',
          debit: 0,
          credit: 5000,
          description: 'Invoice #INV-2024-045 payment'
        }
      ],
      reference: 'PMT-2024-012',
      status: 'pending',
      createdBy: 'sales@company.com',
      createdAt: '2024-12-16T11:15:00Z',
      updatedAt: '2024-12-16T11:15:00Z',
      totalDebit: 5000,
      totalCredit: 5000,
    }
  ];

  mockJournalEntries.push(...mockEntries);
}

// GET /api/journal - List journal entries
export async function GET(request: NextRequest) {
  try {
    const { tenantId } = getAuthInfo(request);
    
    // Seed mock data for demo
    seedMockData(tenantId);
    
    // Filter by tenant
    const tenantEntries = mockJournalEntries.filter(entry => entry.tenantId === tenantId);
    
    // Handle query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Filter by status if provided
    let filteredEntries = tenantEntries;
    if (status && status !== 'all') {
      filteredEntries = tenantEntries.filter(entry => entry.status === status);
    }
    
    // Sort by most recent first
    filteredEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Pagination
    const total = filteredEntries.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEntries = filteredEntries.slice(startIndex, endIndex);
    
    // Calculate stats
    const statusCounts = tenantEntries.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentEntries = tenantEntries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    const stats = {
      totalEntries: tenantEntries.length,
      statusCounts,
      recentEntries,
    };
    
    return NextResponse.json({
      entries: paginatedEntries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats,
    });
    
  } catch (error) {
    console.error('GET /api/journal error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const { userId, tenantId } = getAuthInfo(request);
    const body: CreateJournalEntryRequest = await request.json();
    
    // Validate required fields
    if (!body.date || !body.description || !body.lines || body.lines.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: date, description, and lines are required' },
        { status: 400 }
      );
    }
    
    // Add IDs to lines and validate
    const lines: JournalLine[] = body.lines.map(line => ({
      ...line,
      id: generateLineId(),
    }));
    
    // Validate double-entry accounting
    if (!validateDoubleEntry(lines)) {
      return NextResponse.json(
        { error: 'Invalid journal entry: debits must equal credits' },
        { status: 400 }
      );
    }
    
    // Calculate totals
    const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
    
    // Create new entry
    const newEntry: JournalEntry = {
      id: generateId(),
      tenantId,
      date: body.date,
      description: body.description,
      lines,
      reference: body.reference,
      status: body.status || 'draft',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalDebit,
      totalCredit,
    };
    
    // Add posting date if status is posted
    if (newEntry.status === 'posted') {
      newEntry.postingDate = new Date().toISOString();
    }
    
    mockJournalEntries.push(newEntry);
    
    return NextResponse.json(newEntry, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/journal error:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
