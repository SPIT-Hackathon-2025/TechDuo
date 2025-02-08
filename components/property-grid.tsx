"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";

// Mock data - replace with actual API calls
const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "123 Main St, New York, NY",
    price: 2500,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "Apartment",
  },
  {
    id: 2,
    title: "Luxury Waterfront Condo",
    location: "456 Ocean Dr, Miami, FL",
    price: 3500,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1800,
    type: "Condo",
  },
  {
    id: 3,
    title: "Cozy Garden Villa",
    location: "789 Park Ave, Los Angeles, CA",
    price: 4200,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    type: "Villa",
  },
];

export function PropertyGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link href={`/property/${property.id}`} key={property.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 right-4">
                  {property.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <BedDouble className="h-4 w-4 mr-1" />
                  {property.bedrooms} Beds
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {property.bathrooms} Baths
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {property.sqft} sqft
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="text-xl font-bold">${property.price}/month</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}