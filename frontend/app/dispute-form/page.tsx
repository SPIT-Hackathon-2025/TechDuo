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

export default function DisputeFormPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">File a Dispute</h1>
          <p className="text-muted-foreground">
            Please provide details about your dispute
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Property Selection */}
            <div className="space-y-2">
              <Label htmlFor="property">Select Property</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property-x">
                    Property X - 123 Main St
                  </SelectItem>
                  <SelectItem value="property-y">
                    Property Y - 456 Oak Ave
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Issue Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title of the Issue</Label>
              <Input
                id="title"
                placeholder="Enter a brief title for your dispute"
              />
            </div>

            {/* Issue Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Describe the Issue</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your dispute"
                rows={5}
              />
            </div>

            {/* Your Opinion */}
            <div className="space-y-2">
              <Label htmlFor="opinion">Your Opinion/Verdict</Label>
              <Textarea
                id="opinion"
                placeholder="What do you think would be a fair resolution?"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Upload Images (if any)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or JPEG (MAX. 800x400px)
                    </p>
                  </div>
                  <input id="images" type="file" className="hidden" multiple />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Submit Dispute
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 