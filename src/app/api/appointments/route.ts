import { NextRequest, NextResponse } from 'next/server';
import { getAppointments, createAppointment, getPatientById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sehha_session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patientId = sessionCookie.value;
    const appointments = await getAppointments(patientId);
    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('sehha_session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patientId = sessionCookie.value;
    const patient = await getPatientById(patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const body = await request.json();
    const { doctorId, clinicId, date, time, notes, type } = body;

    if (!doctorId || !clinicId || !date || !time) {
      return NextResponse.json({ error: 'Missing required booking parameters' }, { status: 400 });
    }

    const appt = await createAppointment({
      patientId,
      patientName: patient.name,
      doctorId,
      clinicId,
      date,
      time,
      duration: 30,
      status: 'upcoming',
      type: type || 'General Consultation',
      notes: notes || ''
    });

    return NextResponse.json({ success: true, appointment: appt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
