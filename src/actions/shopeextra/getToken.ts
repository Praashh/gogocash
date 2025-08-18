"use server";

import axios from "axios";

const URL = process.env.NEXT_PUBLIC_SHOPEEXTRA_PREFIX + "/authenticate";

export async function getAuthToken(): Promise<{
  success: boolean;
  token: string | null;
}> {
  console.log("FETCHING TOKEN FROM THE API");
  try {
    const response = await axios.post(URL, {
      key: "general",
      secret: "o1pW16U54vPeK91Yut/SZHRVpuMqo8L5VTRQxjtD7iM=",
    });

    if (!response.data) {
      return {
        success: false,
        token: null,
      };
    } else {
      return {
        success: true,
        token: response.data.data.token,
      };
    }
  } catch (error) {
    console.log(`Error while getting token: ${error}`);
    return {
      success: false,
      token: null,
    };
  }
}
