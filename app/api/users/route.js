import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { uid, email, name, photoURL } = await request.json();

    const client = await clientPromise;
    const db = client.db("college-tinder");
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ uid });
    
    if (existingUser) {
      return NextResponse.json({ 
        message: "User already exists",
        user: existingUser 
      });
    }

    // Create new user profile
    const newUser = {
      uid,
      email,
      name,
      photoURL,
      bio: "",
      gender: "",
      instagram: "",
      swipedRight: [],
      swipedLeft: [],
      matches: [],
      createdAt: new Date()
    };

    await db.collection('users').insertOne(newUser);
    
    return NextResponse.json({ 
      message: "User created successfully",
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
