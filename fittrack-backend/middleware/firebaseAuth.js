const { auth } = require("../config/firebase");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Checks a Firebase ID token sent in the Authorization header
const verifyFirebaseToken = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No Firebase token provided" });
    }

    // ask Firebase if this token is real
    const decoded = await auth.verifyIdToken(token);

    // find our user in MongoDB using the Firebase uid or email
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user && decoded.email) {
      user = await User.findOne({ email: decoded.email });

      // link the Firebase uid to this user for next time
      if (user) {
        user.firebaseUid = decoded.uid;
        await user.save();
      }
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "No FitTrack user for this Firebase account" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

// accepts a normal JWT token OR a Firebase token
const protectAny = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (req.user) return next();
  } catch (error) {
    // not a JWT token, try Firebase next
  }

  return verifyFirebaseToken(req, res, next);
};

module.exports = { verifyFirebaseToken, protectAny };
