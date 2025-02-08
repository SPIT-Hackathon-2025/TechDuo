import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define the Dispute schema
const disputeSchema = new mongoose.Schema({
  did: { type: String, required: true, unique: true },
  pid: { type: String, required: true },
  rid: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  opinion: { type: String },
  images: { type: [String], default: [] }, // Array of image URLs
  status: { type: String, enum: ["open", "closed"], default: "open" },
  arbitrator_verdict: { type: String },
  amount_Decided: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Create a Mongoose model (only if it doesn't already exist)
const Dispute = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);

// ✅ CREATE a new dispute
export async function POST(req) {
  try {
    await connectToDatabase();
    const { did, pid, rid, title, description, opinion, images, status, arbitrator_verdict, amount_Decided } = await req.json();

    if (!did || !pid || !rid || !title || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dispute = new Dispute({
      did,
      pid,
      rid,
      title,
      description,
      opinion,
      images,
      status,
      arbitrator_verdict,
      amount_Decided
    });

    const result = await dispute.save();

    return Response.json({ message: "Dispute added", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error adding dispute: " + error.message }, { status: 500 });
  }
}

// ✅ READ all disputes
export async function GET() {
  try {
    await connectToDatabase();
    const disputes = await Dispute.find({});

    return Response.json(disputes, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching disputes: " + error.message }, { status: 500 });
  }
}

// ✅ UPDATE a dispute by `did`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { did, updates } = await req.json();

    if (!did || !updates) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await Dispute.findOneAndUpdate({ did }, updates, { new: true });

    if (!result) {
      return Response.json({ error: "Dispute not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Dispute updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating dispute: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE a dispute by `did`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { did } = await req.json();

    if (!did) {
      return Response.json({ error: "Missing dispute ID" }, { status: 400 });
    }

    const result = await Dispute.findOneAndDelete({ did });

    if (!result) {
      return Response.json({ error: "Dispute not found" }, { status: 404 });
    }

    return Response.json({ message: "Dispute deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting dispute: " + error.message }, { status: 500 });
  }
}
