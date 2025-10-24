const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // encrypt password
    const hashedPassword = bcrypt.hashSync(password, 8);
    const result = await pool.query(
      `INSERT INTO users(username,password) VALUES($1,$2) RETURNING *`,
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    if (error.constraint === "users_username_key") {
      return res.status(400).json({ message: "Username already exists!" });
    }
    res.status(400).json({ message: "Registration failed." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username exists
    const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);

    // If username does not exist
    if (user.rows.length == 0) {
      return res.status(404).json({ message: "Username does not exist!" });
    }

    // Check if password is valid
    const validPassword = bcrypt.compareSync(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Login failed." });
  }
});

module.exports = router;
