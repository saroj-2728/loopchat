"use server"
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {

    let data = await request.json()
    const { username, password } = data;
    console.log(username, password);

    await connectToDatabase();
    const user = await User.findOne({ username });

    if (!user) {
        return NextResponse.json({ success: false, message: "Error Loginning In!! Invalid Username or Password" })
    }

    return NextResponse.json({ success: true, message: "" })

}
