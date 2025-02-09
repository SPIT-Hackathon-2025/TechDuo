"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
// import ParticlesBackground from "@/components/ParticlesBackground";
import ParticlesBackground  from "../components/ParticleBackground";

export default function LandingPage() {
  const router = useRouter();
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: string) => {
    if (role === "guest") {
      setShowGuestOptions(!showGuestOptions);
    } else if (role === "tenant") {
      router.push("/landing-page");
    } 
    else if (role === "landlord") {
      router.push("/landlord-landing-page");
    }
    else if (role === "arbitrator") {
      router.push("/arbitrator-landing-page");
    }
    else {
      router.push(`/login?role=${role}`);
    }
  };

  const handleGuestLogin = (role: string) => {
    setIsLoading(true);
    setTimeout(() => {
      handleLogin(role);
    }, 1000); // Adjust the delay as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Decorative Element */}
      <div className="py-10"></div>
      <ParticlesBackground />

      <motion.div 
        className="absolute inset-0 opacity-10"
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 50, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[2px] border-gray-400 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-gray-500 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-gray-600 rounded-full" />
      </motion.div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <motion.h1 
            className="text-5xl font-bold tracking-tight text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Welcome to Tor-Rent
          </motion.h1>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Your one-stop solution for transparent tenant-landlord interactions. 
            Secure, transparent, and blockchain-powered rental agreements.
          </motion.p>
        </motion.div>

        {/* Blockchain Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="my-12 flex justify-center"
        >
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg border border-gray-700 max-w-md">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Powered by Blockchain</h3>
            <p className="text-gray-400">
              Experience the future of rental agreements with our secure, 
              transparent, and immutable blockchain technology. Every transaction 
              is verified and recorded for maximum security and trust.
            </p>
          </div>
        </motion.div>

        {/* Buttons Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-12 flex justify-center space-x-6 relative"
        >
          <Button 
            onClick={() => handleLogin("tenant")} 
            className="w-44 h-12"
          >
            Login as Tenant
          </Button>

          <Button 
            onClick={() => handleLogin("arbitrator")} 
            className="w-44 h-12"
          >
            Login as Arbitrator
          </Button>

          <Button 
            onClick={() => handleLogin("landlord")} 
            className="w-44 h-12"
          >
            Login as Landlord
          </Button>

          {/* Guest Login Dropdown */}
          <div className="relative">
            <Button
              onMouseEnter={() => setShowGuestOptions(true)}
              onMouseLeave={() => setShowGuestOptions(false)}
              className="w-44 h-12"
            >
              Guest Login
            </Button>

            <AnimatePresence>
              {showGuestOptions && (
                <motion.div
                  onMouseEnter={() => setShowGuestOptions(true)}
                  onMouseLeave={() => setShowGuestOptions(false)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-44 bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700"
                >
                  <button
                    onClick={() => handleGuestLogin("tenant")}
                    className="block w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    Login as Tenant
                  </button>
                  <button
                    onClick={() => handleGuestLogin("landlord")}
                    className="block w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    Login as Landlord
                  </button>
                  <button
                    onClick={() => handleGuestLogin("arbitrator")}
                    className="block w-full px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    Login as Arbitrator
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Loading Animation */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}