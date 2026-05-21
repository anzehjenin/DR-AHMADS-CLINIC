import { NextRequest, NextResponse } from 'next/server';
import { getPatientById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sehha_session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ patient: null }, { status: 200 });
    }

    const patient = await getPatientById(sessionCookie.value);
    if (!patient) {
      // Clear invalid session
      const response = NextResponse.json({ patient: null }, { status: 200 });
      response.cookies.delete('sehha_session');
      return response;
    }

    return NextResponse.json({ patient });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.set({
      name: 'sehha_session',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      maxAge: -1
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
