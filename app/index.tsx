import React from "react";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Navigate to welcome screen now that we know the app works
    const timer = setTimeout(() => {
      router.replace("/screens/WelcomeScreen");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return null; // Return null since we're navigating away
};

export default Index;