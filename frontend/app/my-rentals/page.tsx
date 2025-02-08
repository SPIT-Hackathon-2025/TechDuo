import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, AlertCircle, DollarSign, FileText } from "lucide-react";
import Link from "next/link";

export default function MyRentalsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Rentals</h1>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          View All Agreements
        </Button>
      </div>

      {/* Active Rentals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((rental) => (
          <Card key={rental}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">Luxury Downtown Apartment</h3>
                  <p className="text-sm text-muted-foreground">123 Main St, New York, NY</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Lease Period</p>
                    <p className="text-sm text-muted-foreground">Jan 2024 - Dec 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Monthly Rent</p>
                    <p className="text-sm text-muted-foreground">$2,500</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Next Payment Due</p>
                  <p className="text-sm text-muted-foreground">February 1, 2024</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Agreement
                  </Button>
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Rent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Payments</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((payment) => (
              <div
                key={payment}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">January 2024 Rent</p>
                    <p className="text-sm text-muted-foreground">
                      Transaction: 0xabc...def
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2,500</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Disputes */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Active Disputes</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active disputes</p>
            <Link href="/dispute-form">
              <Button variant="outline" className="mt-4">
                File a Dispute
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}