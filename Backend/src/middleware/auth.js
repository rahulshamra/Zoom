import jwt from "jsonwebtoken";

const getTokenFromCookie = (cookieHeader = "") => {
  const authCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("auth_token="));

  return authCookie ? decodeURIComponent(authCookie.slice("auth_token=".length)) : null;
};

const authenticate = (req, res, next) => {
  try {
    const token = getTokenFromCookie(req.headers.cookie);

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export { authenticate, getTokenFromCookie };
