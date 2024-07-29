export const endpoint = "localhost:8001"; // Endpoint your Cerebellum server is running on

export const CerebellumOptions = {
  autoConnect: false, // Enable auto-connect, if true, must provide api key or auth route
  API_KEY: "SAMPLE_API_KEY", // API key for authentication, will create a token on the frontend and send it to the backend for authentication
  reconnection: true, // Enable reconnection attempts
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 5000, // Delay between reconnection
  reconnectionDelayMax: 5000, // Maximum delay between reconnection
  timeout: 20000, // Before a connection attempt is considered failed
};
