import { PropertyFilters } from "@/components/property-filters";
import { PropertyGrid } from "@/components/property-grid";

export default function Home() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Perfect Rental Property
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through our curated selection of properties and find your next home. 
          Secure, transparent, and blockchain-powered rental agreements.
        </p>
      </div>
      
      <PropertyFilters />
      <PropertyGrid />
    </div>
  );
}