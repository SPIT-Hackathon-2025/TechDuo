'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Container, Typography, Grid } from '@mui/material';

interface Landlord {
  lid: string;
  name: string;
  properties: string[];
  verification: boolean;
  publicKey: string;
}

export default function LandlordLandingPage() {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const response = await fetch('/api/landlord');
        if (!response.ok) {
          throw new Error('Failed to fetch landlords');
        }
        const data = await response.json();
        setLandlords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Landlord Properties
      </Typography>
      
      <Grid container spacing={3}>
        {landlords.map((landlord) => (
          <Grid item xs={12} key={landlord.lid}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Landlord: {landlord.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  ID: {landlord.lid}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Properties:</Typography>
                  {landlord.properties.length > 0 ? (
                    <ul>
                      {landlord.properties.map((property, index) => (
                        <li key={index}>
                          <Typography>{property}</Typography>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography color="text.secondary">
                      No properties listed
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}