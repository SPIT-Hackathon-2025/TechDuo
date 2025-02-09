"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

// Mock data (Can be removed after integrating API)
const staticProperties = [
  {
    _id: "1",
    title: "Modern Downtown Apartment",
    location: "123 Main St, New York, NY",
    price: 2500,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"],
    type: "Apartment",
  }
];

export function PropertyGrid() {
  const [properties, setProperties] = useState(staticProperties);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch("/api/property");
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          // Ensure properties have at least one image
          const formattedProperties = data
            .filter((property: { images: string | any[]; }) => property.images?.length > 0)
            .map((property: { images: any[]; }) => ({
              ...property,
              image: property.images[0] // Take the first image from the array
            }));
            setProperties(formattedProperties);

          // setProperties((prevProperties) => [...prevProperties, ...formattedProperties]);
        } else {
          console.error("Failed to fetch properties:", data.error);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    
    fetchProperties();
    // setProperties((prevProperties) => [...prevProperties, ...formattedProperties]);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link href={`/property/${property._id}`} key={property._id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 right-4">
                  {property.type || "Property"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              {property.price ? (
                <p className="text-xl font-bold">${property.price}/month</p>
              ) : (
                <p className="text-muted-foreground">Price Not Available</p>
              )}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
