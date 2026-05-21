import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, getClinics, getAvailableSlots } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      doctors: await getDoctors(),
      clinics: await getClinics(),
      availableSlots: await getAvailableSlots()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
