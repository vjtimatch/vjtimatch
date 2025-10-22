import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PUT(request) {
  try {
    const { uid, bio, gender, instagram, photoURL } = await request.json();

    const client = await clientPromise;
    const db = client.db("college-tinder");
    
    // Update user profile
    const result = await db.collection('users').updateOne(
      { uid },
      { 
        $set: { 
          bio, 
          gender, 
          instagram, 
          photoURL,
          profileCompleted: true,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Profile updated successfully" 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
