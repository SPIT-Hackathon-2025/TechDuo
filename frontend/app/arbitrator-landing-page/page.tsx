'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Dispute {
  did: string;
  pid: string;
  rid: string;
  title: string;
  description: string;
  opinion?: string;
  images: string[];
  status: 'open' | 'closed';
  arbitrator_verdict?: string;
  amount_Decided: number;
  createdAt: string;
}

export default function ArbitratorLandingPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await fetch('/api/dispute');
        if (!response.ok) {
          throw new Error('Failed to fetch disputes');
        }
        const data = await response.json();
        setDisputes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const handleUpdateVerdict = async (did: string, verdict: string, amount: number) => {
    try {
      const response = await fetch('/api/dispute', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          did,
          updates: {
            arbitrator_verdict: verdict,
            amount_Decided: amount,
            status: 'closed',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dispute');
      }

      const updatedDisputes = disputes.map(dispute =>
        dispute.did === did
          ? { ...dispute, arbitrator_verdict: verdict, amount_Decided: amount, status: 'closed' }
          : dispute
      );
      setDisputes(updatedDisputes);
    } catch (error) {
      console.error('Error updating dispute:', error);
    }
  };
  const handleResolveWithAI = async () => {
    // Find the first open dispute
    const openDispute = disputes.find(d => d.status === 'open');
    if (!openDispute) {
      alert("No open disputes to resolve.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/analyze-dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ did: openDispute.did }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to resolve dispute with AI');
      }
  
      const result = await response.json();
      alert(`AI Analysis:\nResponsible Party: ${result.analysis.responsible_party}\nResolution: ${result.analysis.resolution_details}`);
    } catch (error) {
      console.error('Error resolving dispute with AI:', error);
    }
  };
  

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Dispute Management Dashboard</h1>
          <p className="text-muted-foreground">Review and manage all ongoing disputes</p>
          <Button onClick={handleResolveWithAI} className="mt-2">Resolve with AI</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.did}>
                  <TableCell>{dispute.did}</TableCell>
                  <TableCell>{dispute.title}</TableCell>
                  <TableCell className="max-w-md truncate">{dispute.description}</TableCell>
                  <TableCell>
                    <Badge variant={dispute.status === 'open' ? 'default' : 'secondary'}>
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{dispute.amount_Decided}</TableCell>
                  <TableCell>
                    {dispute.status === 'open' && (
                      <Button
                        onClick={() => {
                          const verdict = prompt('Enter your verdict:');
                          const amount = parseFloat(prompt('Enter decided amount:') || '0');
                          if (verdict && !isNaN(amount)) {
                            handleUpdateVerdict(dispute.did, verdict, amount);
                          }
                        }}
                      >
                        Resolve
                      </Button>
                    )}
                    {dispute.status === 'closed' && (
                      <div className="text-sm text-gray-500">
                        Verdict: {dispute.arbitrator_verdict}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
