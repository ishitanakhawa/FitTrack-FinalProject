const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../config/firebase");

// function to create a token
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// makes sure this user also exists in Firebase, returns the Firebase uid
const syncFirebaseUser = async (user, password) => {
  try {
    let firebaseUser;

    try {
      // already in Firebase?
      firebaseUser = await auth.getUserByEmail(user.email);
    } catch (error) {
      // not found, so create it
      firebaseUser = await auth.createUser({
        email: user.email,
        password: password,
        displayName: user.name,
      });
    }

    // save the Firebase uid in MongoDB
    if (user.firebaseUid !== firebaseUser.uid) {
      user.firebaseUid = firebaseUser.uid;
      await user.save();
    }

    return firebaseUser.uid;
  } catch (error) {
    console.log("Firebase sync failed:", error.message);
    return null;
  }
};

// creates a Firebase custom token for the user
const getFirebaseToken = async (uid) => {
  try {
    if (!uid) return null;
    return await auth.createCustomToken(uid);
  } catch (error) {
    console.log("Firebase token failed:", error.message);
    return null;
  }
};

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, height } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      height,
    });

    // also create the user in Firebase
    const uid = await syncFirebaseUser(user, password);
    const firebaseToken = await getFirebaseToken(uid);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      firebaseUid: uid,
      firebaseToken: firebaseToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // make sure the user exists in Firebase too
    const uid = user.firebaseUid || (await syncFirebaseUser(user, password));
    const firebaseToken = await getFirebaseToken(uid);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      firebaseUid: uid,
      firebaseToken: firebaseToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
