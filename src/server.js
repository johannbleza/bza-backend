const express = require("express");
const pool = require("./db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const buyersRoutes = require("./routes/buyersRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Create tables on startup
(async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL 
        );
        CREATE TABLE IF NOT EXISTS buyers(
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            contact_no VARCHAR(255) 
        );
        CREATE TABLE IF NOT EXISTS orders(
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            buyer_id INTEGER NOT NULL REFERENCES buyers(id),
            status VARCHAR(255),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS items(
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            quantity INTEGER DEFAULT 1,
            source VARCHAR(255),
            original_price DECIMAL(10, 2),
            selling_price DECIMAL(10, 2),
            status VARCHAR(255),
            order_id INTEGER REFERENCES orders(id)
        );
        CREATE TABLE IF NOT EXISTS payments(
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            amount_paid DECIMAL(10, 2) NOT NULL,
            method VARCHAR(255),
            order_id INTEGER NOT NULL REFERENCES orders(id),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
  } catch (error) {
    console.log(error);
  }
})();

//  Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/items", authMiddleware, itemsRoutes);
app.use("/buyers", authMiddleware, buyersRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
