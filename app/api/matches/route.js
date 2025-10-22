import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { uid } = await request.json();

    const client = await clientPromise;
    const db = client.db("college-tinder");
    
    // Get current user
    const currentUser = await db.collection('users').findOne({ uid });
    
    if (!currentUser) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }

    // Get matched users
    const matchedUserIds = currentUser.matches || [];
    
    if (matchedUserIds.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    // Fetch full user details for matches
    const matches = await db.collection('users')
      .find({ uid: { $in: matchedUserIds } })
      .toArray();

    return NextResponse.json({ matches });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
