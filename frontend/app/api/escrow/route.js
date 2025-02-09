import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define the Escrow Account schema
const escrowSchema = new mongoose.Schema({
  eid: { type: String, required: true, unique: true }, // Escrow ID
  lid: { type: String, required: true }, // Landlord ID
  tid: { type: String, required: true }, // Tenant ID
  rid: { type: String, required: true }, // Rental Agreement ID
  transactions: [
    {
      amount: { type: Number, required: true }, // Transaction amount
      transactionHash: { type: String, required: true }, // Blockchain transaction hash
      transactionType: { type: String, enum: ["debit", "credit"], required: true } // Type: debit or credit
    }
  ],
  fine: { type: Number, default: 0 }, // Fined amount (if any)
  balance: { type: Number, default: 0 }, // Current escrow balance
  createdAt: { type: String, default: () => new Date().toISOString() } // Creation timestamp
});

// Create a Mongoose model (only if it doesn't already exist)
const Escrow = mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);

// ✅ CREATE a new escrow account
export async function POST(req) {
  try {
    await connectToDatabase();
    const { eid, lid, tid, rid, transactions, fine, balance } = await req.json();

    if (!eid || !lid || !tid || !rid) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const escrow = new Escrow({
      eid,
      lid,
      tid,
      rid,
      transactions: transactions || [],
      fine: fine ?? 0,
      balance: balance ?? 0
    });

    const result = await escrow.save();

    return Response.json({ message: "Escrow account created", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error creating escrow account: " + error.message }, { status: 500 });
  }
}

// ✅ READ all escrow accounts
export async function GET(req) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const eid = url.searchParams.get("eid");

    let query = eid ? { eid } : {}; // If eid is provided, filter by it

    const escrows = await Escrow.find(query);

    return Response.json(escrows, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching escrow accounts: " + error.message }, { status: 500 });
  }
}


// ✅ UPDATE an escrow account by `eid`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { eid, updates } = await req.json();

    if (!eid || !updates) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await Escrow.findOneAndUpdate({ eid }, updates, { new: true });

    if (!result) {
      return Response.json({ error: "Escrow account not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Escrow account updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating escrow account: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE an escrow account by `eid`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { eid } = await req.json();

    if (!eid) {
      return Response.json({ error: "Missing escrow account ID" }, { status: 400 });
    }

    const result = await Escrow.findOneAndDelete({ eid });

    if (!result) {
      return Response.json({ error: "Escrow account not found" }, { status: 404 });
    }

    return Response.json({ message: "Escrow account deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting escrow account: " + error.message }, { status: 500 });
  }
}
