import React from "react";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Navigate to test screen first to verify app is working
    const timer = setTimeout(() => {
      router.replace("/test");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return null; // Return null since we're navigating away
};

export default Index;