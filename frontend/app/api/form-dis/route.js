import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Dispute from "@/models/Dispute"; // Ensure you have this model set up

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const body = await req.json();

    const newDispute = new Dispute({
      did: "D1", // Hardcoded
      pid: body.propertyId, // Comes from the frontend Select
      rid: "R1", // Hardcoded
      title: body.title,
      description: body.description,
      opinion: body.opinion,
      images: body.images || [],
      status: "open", // Hardcoded
      arbitrator_verdict: "", // Initially empty
      amount_Decided: 0, // Hardcoded
      createdAt: new Date(),
      __v: 0, // Hardcoded
    });

    await newDispute.save();
    return NextResponse.json({ message: "Dispute filed successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving dispute:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}