import axios from "axios";

const ZEROBOUNCE_API_KEY = "6384e3b859bb48af9eae836d689ea197"; 

export const verifyEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://api.zerobounce.net/v2/validate`, {
      params: {
        api_key: ZEROBOUNCE_API_KEY,
        email: email,
      },
    });

    const { status } = response.data;

    // ZeroBounce statuses: valid, invalid, catch-all, spamtrap, abuse, unknown
    if (status === "valid") {
      return true;
    } else {
      console.warn(`Email verification failed: ${status}`);
      return false;
    }
  } catch (error) {
    console.error("Error verifying email with ZeroBounce:", error);
    return false;
  }
};
