import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define the Rental Agreement schema
const rentalAgreementSchema = new mongoose.Schema({
  rid: { type: String, required: true, unique: true }, // Rental Agreement ID
  pid: { type: String, required: true }, // Property ID
  lid: { type: String, required: true }, // Landlord ID
  tid: { type: String, required: true }, // Tenant ID
  eid: { type: String, required: true }, // Escrow ID
  cid: { type: String, required: true }, // Contract ID
  is_active: { type: Boolean, default: true }, // Agreement Active Status
  content: { type: String, required: true }, // Rules in the agreement
  startDate: { type: String, required: true }, // Start Date (stored as a string)
  endDate: { type: String, required: true }, // End Date (stored as a string)
  createdAt: { type: String, default: () => new Date().toISOString() } // Created At (stored as a string)
}); 

// Create a Mongoose model (only if it doesn't already exist)
const RentalAgreement = mongoose.models.RentalAgreement || mongoose.model("RentalAgreement", rentalAgreementSchema);

// ✅ CREATE a new rental agreement
export async function POST(req) {
  try {
    await connectToDatabase();
    const { rid, pid, lid, tid, eid, cid, is_active, content, startDate, endDate } = await req.json();

    if (!rid || !pid || !lid || !tid || !eid || !cid || !content || !startDate || !endDate) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rentalAgreement = new RentalAgreement({
      rid,
      pid,
      lid,
      tid,
      eid,
      cid,
      is_active: is_active ?? true,
      content,
      startDate,
      endDate
    });

    const result = await rentalAgreement.save();

    return Response.json({ message: "Rental Agreement added", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error adding rental agreement: " + error.message }, { status: 500 });
  }
}

// ✅ READ all rental agreements
export async function GET() {
  try {
    await connectToDatabase();
    const rentalAgreements = await RentalAgreement.find({});

    return Response.json(rentalAgreements, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching rental agreements: " + error.message }, { status: 500 });
  }
}

// ✅ UPDATE a rental agreement by `rid`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { rid, updates } = await req.json();

    if (!rid || !updates) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await RentalAgreement.findOneAndUpdate({ rid }, updates, { new: true });

    if (!result) {
      return Response.json({ error: "Rental agreement not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Rental Agreement updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating rental agreement: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE a rental agreement by `rid`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { rid } = await req.json();

    if (!rid) {
      return Response.json({ error: "Missing rental agreement ID" }, { status: 400 });
    }

    const result = await RentalAgreement.findOneAndDelete({ rid });

    if (!result) {
      return Response.json({ error: "Rental Agreement not found" }, { status: 404 });
    }

    return Response.json({ message: "Rental Agreement deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting rental agreement: " + error.message }, { status: 500 });
  }
}
