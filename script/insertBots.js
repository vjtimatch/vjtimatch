// scripts/insertBots.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const bots = [
  {
    uid: "bot_alice_" + Date.now(),
    email: "alice.bot@vjti.ac.in",
    name: "Alice Johnson",
    photoURL: "https://randomuser.me/api/portraits/women/1.jpg",
    bio: "Computer Science student, loves coding and coffee ☕",
    gender: "female",
    instagram: "alice_codes",
    profileCompleted: true,
    swipedRight: [],
    swipedLeft: [],
    matches: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uid: "bot_bob_" + Date.now() + 1,
    email: "bob.bot@vjti.ac.in",
    name: "Bob Smith",
    photoURL: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Engineering student, gym enthusiast and tech geek 💪",
    gender: "male",
    instagram: "bob_tech",
    profileCompleted: true,
    swipedRight: [],
    swipedLeft: [],
    matches: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uid: "bot_charlie_" + Date.now() + 2,
    email: "charlie.bot@vjti.ac.in",
    name: "Charlie Davis",
    photoURL: "https://randomuser.me/api/portraits/men/2.jpg",
    bio: "Music lover, plays guitar and loves to travel 🎸",
    gender: "male",
    instagram: "charlie_music",
    profileCompleted: true,
    swipedRight: [],
    swipedLeft: [],
    matches: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uid: "bot_diana_" + Date.now() + 3,
    email: "diana.bot@vjti.ac.in",
    name: "Diana Prince",
    photoURL: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "Art student, painter and photographer 🎨",
    gender: "female",
    instagram: "diana_art",
    profileCompleted: true,
    swipedRight: [],
    swipedLeft: [],
    matches: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uid: "bot_emma_" + Date.now() + 4,
    email: "emma.bot@vjti.ac.in",
    name: "Emma Wilson",
    photoURL: "https://randomuser.me/api/portraits/women/3.jpg",
    bio: "Book lover, aspiring writer and coffee addict 📚",
    gender: "female",
    instagram: "emma_writes",
    profileCompleted: true,
    swipedRight: [],
    swipedLeft: [],
    matches: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function insertBots() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db("college-tinder");
    const users = database.collection("users");
    
    const result = await users.insertMany(bots);
    console.log(`✅ ${result.insertedCount} bots inserted successfully!`);
    
  } catch (error) {
    console.error('Error inserting bots:', error);
  } finally {
    await client.close();
  }
}

insertBots();
