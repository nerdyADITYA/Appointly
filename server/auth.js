import { sendWelcome } from "./email.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage.js";
import MongoStore from "connect-mongo";
import { db } from "./db.js"; // Mongoose connection
import { OTP, User } from "./models.js";

const scryptAsync = promisify(scrypt);

const crypto = {
  hash: async (password) => {
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (password, storedHash) => {
    const [hashed, salt] = storedHash.split(".");
    const buf = await scryptAsync(password, salt, 64);
    return timingSafeEqual(Buffer.from(hashed, "hex"), buf);
  }
};

function setupAuth(app) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "appointly-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: db.getClient(), // Use existing mongoose connection client
      // or mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      secure: app.get("env") === "production"
    }
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        // Mongoose returns a document, we can access fields directly.
        if (!user || !await crypto.compare(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id); // user.id is a string getter for _id in Mongoose usually, or user._id
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, otp, ...userData } = req.body;

      if (!otp) return res.status(400).send("OTP is required");

      // Verify OTP
      const otpRecord = await OTP.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(400).send("Invalid or expired OTP");
      }

      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Check if email exists (redundant if schema unique catches it, but cleaner)
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).send("Email already registered");
      }

      const hashedPassword = await crypto.hash(userData.password);
      const user = await storage.createUser({
        ...userData,
        email,
        password: hashedPassword
      });

      // Cleanup OTP
      // Cleanup OTP
      await OTP.deleteMany({ email });

      try {
        await sendWelcome(email, user.name);
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

export {
  crypto,
  setupAuth
};

