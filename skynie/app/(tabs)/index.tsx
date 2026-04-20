import { useEffect } from "react";
import { Text, View } from "react-native";
import { supabase } from "@/src/supabase/client";
import { fetchTestData } from "@/src/supabase/test-supabase";

export default function HomeScreen() {

  useEffect(() => {
    const loadData = async () => {
      console.log("🔥 SCREEN LOADED");

      const data = await fetchTestData();

      if (!data) {
        console.log("❌ No data received");
        return;
      }

      console.log("✅ DATA:", data);
    };

    loadData();
  }, []);

  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}