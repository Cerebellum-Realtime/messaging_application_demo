import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { JwtPayload } from "jsonwebtoken";
interface CustomJwtPayload extends JwtPayload {
  appName: string;
}

const secret = process.env.API_KEY || "sample key";

const isValid = (socket: Socket) => {
  const token: string | undefined = socket.handshake.auth.token;
  if (!token) return false;

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secret);
  } catch (error) {
    console.error("Bad token: ", error);
    return false;
    // close connection
  }

  console.log("Decoded token: ", decodedToken);
  return true;
}; // TODO: IMPLEMENT STORAGE FOR TOKENS AND FUNCTION TO VALIDATE TOKENS

export const authenticate = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  console.log("Started auth process");

  if (!isValid(socket)) {
    const errorMessage = "Authentication error: Token missing";
    console.error("Error occurred in auth process:", errorMessage);
    next(new Error("Authentication error"));
  }

  console.log("auth process successful");
  next();
};
