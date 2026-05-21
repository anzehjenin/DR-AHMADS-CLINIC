import { NextRequest, NextResponse } from 'next/server';
import { cancelAppointment, rescheduleAppointment } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const sessionCookie = request.cookies.get('sehha_session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await cancelAppointment(id);
    if (!success) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const sessionCookie = request.cookies.get('sehha_session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slotId } = body;
    if (!slotId) {
      return NextResponse.json({ error: 'Missing slotId for rescheduling' }, { status: 400 });
    }

    const success = await rescheduleAppointment(id, slotId);
    if (!success) {
      return NextResponse.json({ error: 'Rescheduling failed. Slot might be unavailable.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Appointment rescheduled successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST endpoint as a fallback for cancel/reschedule actions
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const sessionCookie = request.cookies.get('sehha_session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, slotId } = body;

    if (action === 'cancel') {
      const success = await cancelAppointment(id);
      if (!success) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Appointment cancelled successfully' });
    }

    if (action === 'reschedule') {
      if (!slotId) {
        return NextResponse.json({ error: 'Missing slotId for rescheduling' }, { status: 400 });
      }
      const success = await rescheduleAppointment(id, slotId);
      if (!success) {
        return NextResponse.json({ error: 'Rescheduling failed. Slot might be unavailable.' }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: 'Appointment rescheduled successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
