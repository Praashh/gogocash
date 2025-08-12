"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignOut() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignedOut, setIsSignedOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      console.log("Signing out...");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // await signOut();
      
      setIsSignedOut(true);
      console.log("Signout successful!");
      
    } catch (error) {
      console.error("Signout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignedOut) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-4">
              <div className="w-6 h-6 bg-green-300 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">GoGoCash</h1>
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Successfully Signed Out
              </CardTitle>
              <CardDescription className="text-gray-400">
                You have been signed out of your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Thank you for using GoGoCash. Come back soon!
              </p>
              
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3">
                    Sign In Again
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-3">
                    Go to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-4">
            <div className="w-6 h-6 bg-green-300 rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold text-white">GoGoCash</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Sign Out
            </CardTitle>
            <CardDescription className="text-gray-400">
              Are you sure you want to sign out?
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="text-gray-400 mb-6">
              You will need to sign in again to access your account
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleSignOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Signing Out..." : "Yes, Sign Out"}
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-3">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}