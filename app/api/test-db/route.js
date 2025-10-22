import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("college-tinder");
    
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({ 
      message: "MongoDB Connected!", 
      collections: collections 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
