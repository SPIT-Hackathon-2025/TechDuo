import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define the Contract schema
const contractSchema = new mongoose.Schema({
  cid: { type: String, required: true, unique: true }, // Contract ID
  pid: { type: String, required: true }, // Property ID
  lid: { type: String, required: true }, // Landlord ID
  rentAmount: { type: Number, required: true }, // Rent Amount
  paymentFrequency: { type: String, enum: ["monthly", "quarterly", "yearly"], required: true }, // Payment Frequency
  securityDeposit: { type: Number, required: true }, // Security Deposit
  createdAt: { type: Date, default: Date.now }
});

// Create a Mongoose model (only if it doesn't already exist)
const Contract = mongoose.models.Contract || mongoose.model("Contract", contractSchema);

// ✅ CREATE a new contract
export async function POST(req) {
  try {
    await connectToDatabase();
    const { cid, pid, lid, rentAmount, paymentFrequency, securityDeposit } = await req.json();

    if (!cid || !pid || !lid || !rentAmount || !paymentFrequency || !securityDeposit) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contract = new Contract({
      cid,
      pid,
      lid,
      rentAmount,
      paymentFrequency,
      securityDeposit
    });

    const result = await contract.save();

    return Response.json({ message: "Contract added", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error adding contract: " + error.message }, { status: 500 });
  }
}

// ✅ READ all contracts
export async function GET() {
  try {
    await connectToDatabase();
    const contracts = await Contract.find({});

    return Response.json(contracts, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching contracts: " + error.message }, { status: 500 });
  }
}

// ✅ UPDATE a contract by `cid`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { cid, updates } = await req.json();

    if (!cid || !updates) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await Contract.findOneAndUpdate({ cid }, updates, { new: true });

    if (!result) {
      return Response.json({ error: "Contract not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Contract updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating contract: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE a contract by `cid`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { cid } = await req.json();

    if (!cid) {
      return Response.json({ error: "Missing contract ID" }, { status: 400 });
    }

    const result = await Contract.findOneAndDelete({ cid });

    if (!result) {
      return Response.json({ error: "Contract not found" }, { status: 404 });
    }

    return Response.json({ message: "Contract deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting contract: " + error.message }, { status: 500 });
  }
}
