import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Star, Clock, Shield, Upload, Building2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground">0x1234...5678</p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="secondary">Tenant</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Reputation Score</span>
              </div>
              <span className="font-semibold">4.8/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Member Since</span>
              </div>
              <span className="font-semibold">Jan 2024</span>
            </div>
            <Button className="w-full mt-4">
              <Shield className="h-4 w-4 mr-2" />
              Verify Identity
            </Button>
          </CardContent>
        </Card>

        {/* Rental History & Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="text-xl font-semibold">Rental History</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Past Rentals */}
            <div className="space-y-4">
              {[1, 2].map((rental) => (
                <div
                  key={rental}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Luxury Downtown Apartment</h4>
                    <p className="text-sm text-muted-foreground">
                      Jan 2024 - Present
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">On-time Payments</Badge>
                      <Badge variant="outline">No Disputes</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Upload Section */}
            <div className="mt-6">
              <h4 className="font-semibold mb-4">Identity Verification</h4>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop your KYC documents here or click to upload
                </p>
                <Button variant="outline" className="mt-4">
                  Upload Documents
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}