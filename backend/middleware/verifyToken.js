import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "token is invalid!" });
    }
    req.decoded = decoded;
    next();
  });
};
