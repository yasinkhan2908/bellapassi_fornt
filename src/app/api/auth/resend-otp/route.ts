import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { mobile } = await request.json();

        // Call your existing OTP generation API
        const response = await fetch(`${process.env.BACKEND_URL}/api/user/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile }),
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json({
                success: true,
                message: data.message,
                otp: data.otp, // if your API returns OTP for development
            });
        } else {
            return NextResponse.json(
                { success: false, message: data.message || 'Failed to resend OTP' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}