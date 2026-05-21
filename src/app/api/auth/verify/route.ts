import { NextRequest, NextResponse } from 'next/server';
import { getPatientByPhone } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and verification code are required' }, { status: 400 });
    }

    if (code !== '1234') {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const patient = await getPatientByPhone(phone);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Set secure session cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Successfully verified',
      patient 
    });

    response.cookies.set({
      name: 'sehha_session',
      value: patient.id,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
