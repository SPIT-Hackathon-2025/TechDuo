"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, User, Building2, Wallet } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Building2 className="h-6 w-6" />
          <span className="font-bold text-xl">ToRent</span>
        </Link>
        
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/">
            <Button variant="ghost" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/my-rentals">
            <Button variant="ghost" className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              My Rentals
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
}