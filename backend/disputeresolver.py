import os
import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
from pydantic import BaseModel, Field, ValidationError
from groq import Groq

app = Flask(__name__)
CORS(app)  

# 🔹 MongoDB Connection
MONGO_URI = "mongodb+srv://hmaikap:hmaikap@cluster0.fxlcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.get_database("ToRentData")
collection = db.get_collection("disputes")

# 🔹 Groq API Client
groq_client = Groq(api_key="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")

# ✅ Structured Response Model
class DisputeAnalysis(BaseModel):
    responsible_party: str = Field(description="The party responsible, either 'tenant' or 'landlord'.")
    resolution_details: str = Field(description="Explanation of the dispute resolution.")

# ✅ Generate Prompt for LLM
def create_prompt(dispute_title, description, opinion):
    return f"""
    You are an expert in property disputes. Analyze the case and determine:
    1. The responsible party ('tenant' or 'landlord').
    2. The resolution details.

    Dispute Title: {dispute_title}
    Description: {description}
    Opinion: {opinion}

    Provide response in JSON format:
    {{
        "responsible_party": "tenant or landlord",
        "resolution_details": "detailed explanation"
    }}
    """

# ✅ LLM Analysis Function
def analyze_dispute(dispute_title, description, opinion):
    prompt = create_prompt(dispute_title, description, opinion)

    try:
        chat_completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )

        # Clean and parse JSON response
        response_content = chat_completion.choices[0].message.content.strip("```json").strip("```").strip()
        parsed_json = json.loads(response_content)  # Convert to dict
        analysis = DisputeAnalysis.model_validate(parsed_json)  # Validate with Pydantic

        return analysis.dict()

    except json.JSONDecodeError as e:
        return {"error": f"Error parsing JSON: {str(e)}"}
    except ValidationError as e:
        return {"error": f"Validation Error: {str(e)}"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

# ✅ Flask API Route (POST Request)
@app.route('/analyze-dispute', methods=['POST'])
def post_dispute_analysis():
    try:
        # Get JSON data from request
        data = request.json

        if not data or "did" not in data:
            return jsonify({"error": "Missing '_id' field in request body"}), 400

        dispute_id = data["did"]
        try:
            query = {"did": dispute_id}
        except Exception:
            return jsonify({"error": "Invalid ObjectId format"}), 400

        # Fetch dispute from MongoDB
        document = collection.find_one(query)

        if not document:
            return jsonify({"error": "No document found"}), 404

        # Extract necessary fields
        dispute_title = document.get('disputetitle', 'No Title')
        description = document.get('description', 'No Description')
        opinion = document.get('opinion', 'No Opinion')

        # Analyze dispute using LLM
        analysis = analyze_dispute(dispute_title, description, opinion)
        return jsonify({"dispute_id": dispute_id, "analysis": analysis})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
