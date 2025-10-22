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

    // Get opposite gender users
    const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male';
    
    // Get users to exclude (already swiped)
    // const swipedUsers = [
    //   ...(currentUser.swipedRight || []),
    //   ...(currentUser.swipedLeft || []),
    //   uid // exclude yourself
    // ];
    const swipedUsers = [
      ...(currentUser.swipedRight || []),
      uid // exclude yourself
    ];

    // Find potential matches
    const potentialMatches = await db.collection('users')
      .find({
        gender: oppositeGender,
        uid: { $nin: swipedUsers },
        profileCompleted: true
      })
      .limit(20)
      .toArray();

    return NextResponse.json({ 
      users: potentialMatches 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
