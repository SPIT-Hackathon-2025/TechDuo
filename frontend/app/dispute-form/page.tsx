"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DisputeFormPage() {
  const [formData, setFormData] = useState({
    did: "", // Will be generated
    pid: "", // This will come from propertyId
    rid: "", // This should be set based on your requirements
    title: "",
    description: "",
    opinion: "",
    images: [],
    status: "open",
    arbitrator_verdict: "",
    amount_Decided: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: { target: { id: string; value: any; }; }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const generateDisputeId = () => {
    // Simple dispute ID generator - you might want to use a more robust solution
    return 'D' + Date.now().toString();
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare the submission data
      const submissionData = {
        ...formData,
        did: generateDisputeId(),
        pid: formData.pid || "default-property", // Ensure this is set
        rid: "default-resident", // Set this based on your needs
      };

      const response = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push("/success"); // Redirect after success
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit dispute");
      }
    } catch (error) {
      setError("Error submitting dispute. Please try again.");
      console.error("Error submitting dispute:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <CardHeader className="text-2xl font-bold">Submit a Dispute</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="propertyId">Select Property</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, pid: val })}>
              <SelectTrigger><SelectValue placeholder="Select a property" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="property-x">Property X - 123 Main St</SelectItem>
                <SelectItem value="property-y">Property Y - 456 Oak Ave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title of the Issue</Label>
            <Input 
              id="title" 
              placeholder="Enter a brief title" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe the Issue</Label>
            <Textarea 
              id="description" 
              placeholder="Provide details" 
              rows={5} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opinion">Your Opinion/Verdict</Label>
            <Textarea 
              id="opinion" 
              placeholder="Fair resolution" 
              rows={3} 
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}