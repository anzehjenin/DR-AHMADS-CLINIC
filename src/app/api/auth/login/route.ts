import { NextRequest, NextResponse } from 'next/server';
import { getPatientByPhone, createPatient } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Try finding or creating the patient so they can sign in
    let patient = await getPatientByPhone(phone);
    if (!patient) {
      // Dynamic registration for new users!
      patient = await createPatient({
        name: 'New Patient',
        email: 'new.patient@email.com',
        phone: phone.startsWith('+') ? phone : `+966 ${phone}`,
        avatar: '👤'
      });
    }

    // In a real application, we would call an SMS API here.
    // For our operational version, we simulate generating OTP '1234'
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully',
      debugOtp: '1234', // Sent to frontend to make testing seamless
      phone: patient.phone
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
