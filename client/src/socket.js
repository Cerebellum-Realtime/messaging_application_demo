import { io } from "socket.io-client";

const URL = "ALB-ws-1063097076.us-east-1.elb.amazonaws.com";

//Avery: ALB-WS-Server-958728794.us-east-1.elb.amazonaws.com
//will's url: ALB-for-backend-health-1634376545.us-east-2.elb.amazonaws.com

export const socket = io(URL, {
  withCredentials: true,

  // path: "/socket.io",
  transports: ["polling"], // Include both websocket and polling as fallback
});

// Ensure credentialed requests are not sent to CORS resources with origin wildcards
