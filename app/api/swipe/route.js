import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { uid, targetUid, direction } = await request.json();

    const client = await clientPromise;
    const db = client.db("college-tinder");
    
    // Update current user's swipes
    const updateField = direction === 'right' ? 'swipedRight' : 'swipedLeft';
    
    await db.collection('users').updateOne(
      { uid },
      { $addToSet: { [updateField]: targetUid } }
    );

    // Check for match (only if swiped right)
    let isMatch = false;
    if (direction === 'right') {
      const targetUser = await db.collection('users').findOne({ uid: targetUid });
      
      if (targetUser?.swipedRight?.includes(uid)) {
        // It's a match!
        isMatch = true;
        
        // Add to both users' matches
        await db.collection('users').updateOne(
          { uid },
          { $addToSet: { matches: targetUid } }
        );
        
        await db.collection('users').updateOne(
          { uid: targetUid },
          { $addToSet: { matches: uid } }
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      isMatch 
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
