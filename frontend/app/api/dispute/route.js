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
  images: { type: [String], default: [] },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  arbitrator_verdict: { type: String },
  amount_Decided: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Create the Mongoose model
const Dispute = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);

// ✅ CREATE - Create a new dispute
export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['did', 'pid', 'rid', 'title', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return Response.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Create new dispute document
    const dispute = new Dispute({
      did: body.did,
      pid: body.pid,
      rid: body.rid,
      title: body.title,
      description: body.description,
      opinion: body.opinion || "",
      images: body.images || [],
      status: body.status || "open",
      arbitrator_verdict: body.arbitrator_verdict || "",
      amount_Decided: body.amount_Decided || 0
    });

    const savedDispute = await dispute.save();
    
    return Response.json({
      message: "Dispute created successfully",
      dispute: savedDispute
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating dispute:", error);
    
    if (error.code === 11000) {
      return Response.json({ 
        error: "A dispute with this ID already exists" 
      }, { status: 409 });
    }

    return Response.json({ 
      error: "Failed to create dispute" 
    }, { status: 500 });
  }
}

// ✅ READ - Get all disputes
export async function GET(req) {
  try {
    await connectToDatabase();
    
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const pid = searchParams.get('pid');
    const status = searchParams.get('status');
    
    // Build query based on parameters
    let query = {};
    if (pid) query.pid = pid;
    if (status) query.status = status;

    const disputes = await Dispute.find(query).sort({ createdAt: -1 });
    
    return Response.json({
      disputes,
      count: disputes.length
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return Response.json({ 
      error: "Failed to fetch disputes" 
    }, { status: 500 });
  }
}

// ✅ UPDATE - Update a dispute
export async function PUT(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { did, ...updates } = body;

    if (!did) {
      return Response.json({ 
        error: "Dispute ID is required" 
      }, { status: 400 });
    }

    const updatedDispute = await Dispute.findOneAndUpdate(
      { did },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedDispute) {
      return Response.json({ 
        error: "Dispute not found" 
      }, { status: 404 });
    }

    return Response.json({
      message: "Dispute updated successfully",
      dispute: updatedDispute
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating dispute:", error);
    return Response.json({ 
      error: "Failed to update dispute" 
    }, { status: 500 });
  }
}

// ✅ DELETE - Delete a dispute
export async function DELETE(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { did } = body;

    if (!did) {
      return Response.json({ 
        error: "Dispute ID is required" 
      }, { status: 400 });
    }

    const deletedDispute = await Dispute.findOneAndDelete({ did });

    if (!deletedDispute) {
      return Response.json({ 
        error: "Dispute not found" 
      }, { status: 404 });
    }

    return Response.json({
      message: "Dispute deleted successfully",
      dispute: deletedDispute
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting dispute:", error);
    return Response.json({ 
      error: "Failed to delete dispute" 
    }, { status: 500 });
  }
}

// Helper Functions

// Get a single dispute by ID
export async function getDisputeById(did) {
  try {
    await connectToDatabase();
    const dispute = await Dispute.findOne({ did });
    return dispute;
  } catch (error) {
    console.error("Error fetching dispute:", error);
    throw error;
  }
}

// Get disputes by property ID
export async function getDisputesByProperty(pid) {
  try {
    await connectToDatabase();
    const disputes = await Dispute.find({ pid }).sort({ createdAt: -1 });
    return disputes;
  } catch (error) {
    console.error("Error fetching property disputes:", error);
    throw error;
  }
}

// Get disputes by resident ID
export async function getDisputesByResident(rid) {
  try {
    await connectToDatabase();
    const disputes = await Dispute.find({ rid }).sort({ createdAt: -1 });
    return disputes;
  } catch (error) {
    console.error("Error fetching resident disputes:", error);
    throw error;
  }
}

// Get disputes by status
export async function getDisputesByStatus(status) {
  try {
    await connectToDatabase();
    const disputes = await Dispute.find({ status }).sort({ createdAt: -1 });
    return disputes;
  } catch (error) {
    console.error("Error fetching disputes by status:", error);
    throw error;
  }
}

// Update dispute status
export async function updateDisputeStatus(did, status) {
  try {
    await connectToDatabase();
    const dispute = await Dispute.findOneAndUpdate(
      { did },
      { status },
      { new: true }
    );
    return dispute;
  } catch (error) {
    console.error("Error updating dispute status:", error);
    throw error;
  }
}

// Add arbitrator verdict
export async function addArbitratorVerdict(did, verdict, amount) {
  try {
    await connectToDatabase();
    const dispute = await Dispute.findOneAndUpdate(
      { did },
      { 
        arbitrator_verdict: verdict,
        amount_Decided: amount,
        status: 'closed'
      },
      { new: true }
    );
    return dispute;
  } catch (error) {
    console.error("Error adding arbitrator verdict:", error);
    throw error;
  }
}