import jwt from "jsonwebtoken";
const SECRET = "SECRET";

const args = process.argv.slice(2);
// const appName = args[0];

// const token = {
//   appName,
// };

const signedToken = jwt.sign({}, SECRET); // creates a signed token with the jwt secret - token will always be the same given the same string + secret combo
console.log(signedToken);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY2hhdEFwcCIsImlhdCI6MTcyMDg5NTY0OX0.3XHwgmOzYEX5-QR9fT0UT-DLfNgK_gxYIJFT0yc5F8g
// jwt.verify(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBOYW1lIjoiY2hhdEFwcCIsImlhdCI6MTcyMDg5NTY0OX0.3XHwgmOzYEX5-QR9fT0UT-DLfNgK_gxYIJFT0yc5F8g, SECRET)
