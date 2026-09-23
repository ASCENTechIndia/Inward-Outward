import axios from "axios";

const GetIPAddress = async () => {
  const useDummyIp = true; // <-- toggle this flag to switch between dummy or real IP

  if (useDummyIp) {
    // Return dummy IP without calling API
    return "192.168.0.1";
  }

  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

export default GetIPAddress;
