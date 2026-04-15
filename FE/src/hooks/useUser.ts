import { apiClient } from "@/lib/apiClient";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);
  async function getMyInformation() {
    try {
      const response = await apiClient.get("/users/me");
      console.log("My information:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching my information:", error);
      throw error;
    }
  }

  useEffect(() => {
    getMyInformation();
  }, []);

  return { user, getMyInformation };
};
