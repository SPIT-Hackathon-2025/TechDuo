"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Calendar, DollarSign, FileText } from "lucide-react";
import { Calendar, DollarSign, FileText, Gavel } from "lucide-react";

interface RentalAgreement {
  rid: string;
  pid: string;
  lid: string;
  tid: string;
  eid: string;
  cid: string;
  is_active: boolean;
  content: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface PropertyDetails {
  _id: string;
  pid: string;
  lid: string;
  images: string[];
  title: string;
  location: string;
  size?: string;
  sqft?: number;
  price?: number;
  type?: string;
  rid: string;
  createdAt: string;
}

interface LandlordDetails {
  lid: string;
  name: string;
  properties: string[];
  verification: boolean;
  publicKey: string;
}

interface Dispute {
  did: string;
  pid: string;
  rid: string;
  title: string;
  description: string;
  opinion?: string;
  images: string[];
  status: "open" | "closed";
  arbitrator_verdict?: string;
  amount_Decided: number;
  createdAt: string;
}

interface EscrowTransaction {
  _id: string;
  amount: number;
  transactionHash: string;
  transactionType: "debit" | "credit";
}

interface Escrow {
  _id: string;
  eid: string;
  lid: string;
  tid: string;
  rid: string;
  transactions?: EscrowTransaction[];
  fine: number;
  balance: number;
  createdAt: string;
  __v: number;
}

interface RentalAgreementWithDetails extends RentalAgreement {
  propertyDetails?: PropertyDetails;
  landlordDetails?: LandlordDetails;
  escrow?: Escrow[];
}

export default function MyRentalsPage() {
  const [agreements, setAgreements] = useState<RentalAgreementWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await fetch("/api/rentalagreement");
        if (!response.ok) {
          throw new Error("Failed to fetch rental agreements");
        }

        const data: RentalAgreement[] = await response.json();

        const enrichedAgreements = await Promise.all(
          data.map(async (agreement) => {
            let propertyDetails: PropertyDetails | undefined;
            let landlordDetails: LandlordDetails | undefined;
            let escrow: Escrow[] = [];

            try {
              const propertyRes = await fetch(`/api/property?pid=${agreement.pid}`);
              if (propertyRes.ok) {
                propertyDetails = await propertyRes.json();
              }

              const landlordRes = await fetch(`/api/landlord?lid=${agreement.lid}`);
              if (landlordRes.ok) {
                landlordDetails = await landlordRes.json();
              }

              const escrowRes = await fetch(`/api/escrow?rid=${agreement.rid}`);
              if (escrowRes.ok) {
                escrow = await escrowRes.json();
                console.log(escrow);
              }
              const disputesRes = await fetch("/api/dispute");
              if (!disputesRes.ok) throw new Error("Failed to fetch disputes");
              const disputesData: Dispute[] = await disputesRes.json();
              setDisputes(disputesData);
      
            } catch (error) {
              console.error("Error fetching additional details:", error);
            }

            return { ...agreement, propertyDetails, landlordDetails, escrow};
          })
        );

        setAgreements(enrichedAgreements);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching agreements.");
        setLoading(false);
      }
    };

    fetchAgreements();
  }, []);
  console.log(agreements);  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Rentals</h1>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          View All Agreements
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading rentals...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : agreements.length > 0 ? (
          agreements.map((rental) => (
            <Card key={rental.pid}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{rental.propertyDetails?.title}</h3>
                    <p className="text-sm text-muted-foreground">{rental.propertyDetails?.location}</p>
                  </div>
                  <Badge className={`bg-${rental.is_active ? "green" : "red"}-100 text-${rental.is_active ? "green" : "red"}-800`}>
                    {rental.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Lease Period</p>
                      <p className="text-sm text-muted-foreground">{rental.startDate} - {rental.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Monthly Rent</p>
                      <p className="text-sm text-muted-foreground">${rental.propertyDetails?.price}</p>
                    </div>
                  </div>
                </div>

                {/* Escrow Details */}
                {rental.escrow && rental.escrow.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold mt-2">Escrow Transactions:</h4>
                    {rental.escrow.map((escrowItem) => (
                      <div key={escrowItem._id} className="mt-2">
                        <p className="text-sm font-medium">Balance: ${escrowItem.balance}</p>
                        {escrowItem.transactions && escrowItem.transactions.length > 0 ? (
                          <ul className="text-sm text-muted-foreground">
                            {escrowItem.transactions.map((txn, index) => (
                              <li key={txn._id} className="border-b py-1">
                                {txn.transactionType.toUpperCase()} - ${txn.amount} | TX: {txn.transactionHash}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No transactions available.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Agreement
                  </Button>
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Rent
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No rental agreements found.</p>
        )}
      </div>
      <h2 className="text-2xl font-bold mt-8">Disputes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading disputes...</p>
        ) : disputes.length > 0 ? (
          disputes.map((dispute) => (
            <Card key={dispute.did}>
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold">{dispute.title}</h3>
                <Badge className={`bg-${dispute.status === "open" ? "orange" : "gray"}-100 text-${dispute.status === "open" ? "orange" : "gray"}-800`}>
                  {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
                {dispute.arbitrator_verdict && (
                  <div className="mt-2">
                    <h4 className="text-md font-semibold">Arbitrator Verdict:</h4>
                    <p className="text-sm text-muted-foreground">{dispute.arbitrator_verdict}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">${dispute.amount_Decided}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Gavel className="h-4 w-4 mr-2" />
                    View Dispute
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No disputes found.</p>
        )}
      </div>
    </div>
  );
}
