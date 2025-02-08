export const dynamic = "force-dynamic";
import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

// Define the property schema
const propertySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // Use MongoDB's ObjectID
  pid: { type: String, required: true, unique: true },
  lid: { type: String, required: true },
  images: { type: [String], default: [] },
  title: { type: String, required: true },
  location: { type: String, required: true },
  size: { type: String },
  sqft: { type: Number, min: 0 },
  price: { type: Number, min: 0 },
  type: { type: String },
  rid: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create Mongoose model
const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

// ✅ CREATE a new property
export async function POST(req) {
  try {
    await connectToDatabase();
    const { pid, lid, images, title, location, size, sqft, price, type, rid } = await req.json();

    if (!pid || !lid || !title || !location || !rid) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = new Property({
      _id: new mongoose.Types.ObjectId(), // Generate new ObjectId
      pid,
      lid,
      images: Array.isArray(images) ? images : [], // Ensure images is an array
      title,
      location,
      size,
      sqft: sqft > 0 ? sqft : null, // Ensure positive sqft
      price: price > 0 ? price : null, // Ensure positive price
      type,
      rid,
    });

    const result = await property.save();
    return Response.json({ message: "Property added", result }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error adding property: " + error.message }, { status: 500 });
  }
}

// ✅ READ all properties
export async function GET() {
  try {
    await connectToDatabase();
    const properties = await Property.find({});
    return Response.json(properties, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching properties: " + error.message }, { status: 500 });
  }
}

// ✅ UPDATE a property by `pid`
export async function PUT(req) {
  try {
    await connectToDatabase();
    const { pid, updates } = await req.json();

    if (!pid || !updates || typeof updates !== "object") {
      return Response.json({ error: "Missing or invalid update data" }, { status: 400 });
    }

    // Ensure only valid fields are updated
    const allowedUpdates = ["images", "title", "location", "size", "sqft", "price", "type"];
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

    if (Object.keys(sanitizedUpdates).length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const result = await Property.findOneAndUpdate({ pid }, sanitizedUpdates, { new: true });

    if (!result) {
      return Response.json({ error: "Property not found or no changes made" }, { status: 404 });
    }

    return Response.json({ message: "Property updated", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error updating property: " + error.message }, { status: 500 });
  }
}

// ✅ DELETE a property by `pid`
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { pid } = await req.json();

    if (!pid) {
      return Response.json({ error: "Missing property ID" }, { status: 400 });
    }

    const result = await Property.findOneAndDelete({ pid });

    if (!result) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }

    return Response.json({ message: "Property deleted", result }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting property: " + error.message }, { status: 500 });
  }
}
