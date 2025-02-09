import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// ✅ Define the landlord schema
const landlordSchema = new mongoose.Schema({
    lid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    properties: { type: [String], default: [] },
    verification: { type: Boolean, default: false },
    publicKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// ✅ Create a Mongoose model (if not already created)
const Landlord = mongoose.models.Landlord || mongoose.model("Landlord", landlordSchema);

// ✅ CREATE a new landlord
export async function POST(req) {
  try {
    await connectToDatabase();
    const { lid, name, properties, verification, publicKey } = await req.json();

    if (!lid || !name || !publicKey) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const landlord = new Landlord({ lid, name, properties, verification, publicKey });
    const result = await landlord.save();

    return Response.json({ message: "Landlord added", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error adding landlord: " + error.message }, { status: 500 });
  }
}

// ✅ READ all landlords
export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const lid = searchParams.get("lid");

    if (lid) {
      const landlord = await Landlord.findOne({ lid });

      if (!landlord) {
        return Response.json({ error: "Landlord not found" }, { status: 404 });
      }

      return Response.json(landlord, { status: 200 });
    }

    const landlords = await Landlord.find({});
    return Response.json(landlords, { status: 200 });

  } catch (error) {
    return Response.json({ error: "Error fetching landlords: " + error.message }, { status: 500 });
  }
}

// ✅ UPDATE a landlord by `lid`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { lid, updates } = await req.json();

    if (!lid || !updates) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await Landlord.findOneAndUpdate({ lid }, updates, { new: true });

    if (!result) {
      return Response.json({ error: "Landlord not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Landlord updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating landlord: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE a landlord by `lid`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { lid } = await req.json();

    if (!lid) {
      return Response.json({ error: "Missing landlord ID" }, { status: 400 });
    }

    const result = await Landlord.findOneAndDelete({ lid });

    if (!result) {
      return Response.json({ error: "Landlord not found" }, { status: 404 });
    }

    return Response.json({ message: "Landlord deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting landlord: " + error.message }, { status: 500 });
  }
}
