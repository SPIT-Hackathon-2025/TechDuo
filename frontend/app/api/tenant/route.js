import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define the Tenant schema
const tenantSchema = new mongoose.Schema({
  tid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  properties: { type: [String], default: [] },
  verification: { type: Boolean, default: false },
  publicKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a Mongoose model (only if it doesn't already exist)
const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

// ✅ CREATE a new tenant
export async function POST(req) {
  try {
    await connectToDatabase();
    const { tid, name, properties, verification, publicKey } = await req.json();

    if (!tid || !name || !publicKey) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tenant = new Tenant({ tid, name, properties, verification, publicKey });
    const result = await tenant.save();

    return Response.json({ message: "Tenant added", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error adding tenant: " + error.message }, { status: 500 });
  }
}

// ✅ READ all tenants
export async function GET() {
  try {
    await connectToDatabase();
    const tenants = await Tenant.find({});

    return Response.json(tenants, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching tenants: " + error.message }, { status: 500 });
  }
}

// ✅ UPDATE a tenant by `tid`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { tid, updates } = await req.json();

    if (!tid || !updates) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await Tenant.findOneAndUpdate({ tid }, updates, { new: true });

    if (!result) {
      return Response.json({ error: "Tenant not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Tenant updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating tenant: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE a tenant by `tid`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { tid } = await req.json();

    if (!tid) {
      return Response.json({ error: "Missing tenant ID" }, { status: 400 });
    }

    const result = await Tenant.findOneAndDelete({ tid });

    if (!result) {
      return Response.json({ error: "Tenant not found" }, { status: 404 });
    }

    return Response.json({ message: "Tenant deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting tenant: " + error.message }, { status: 500 });
  }
}
