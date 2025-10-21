const express = require("express");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL 
        );
        CREATE TABLE IF NOT EXISTS buyers(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            contact_no VARCHAR(255) 
        );
        CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            source VARCHAR(255),
            original_price DECIMAL(10, 2),
            selling_price DECIMAL(10, 2),
            status VARCHAR(255) DEFAULT 'not yet arrived'
        );
        CREATE TABLE IF NOT EXISTS orders(
            id SERIAL PRIMARY KEY,
            item_id INTEGER NOT NULL REFERENCES items(id),
            buyer_id INTEGER NOT NULL REFERENCES buyers(id),
            balance_amount DECIMAL(10, 2),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(255) DEFAULT 'unpaid'
        );
        CREATE TABLE IF NOT EXISTS payments(
            id SERIAL PRIMARY KEY,
            amount_paid DECIMAL(10, 2),
            order_id INTEGER NOT NULL REFERENCES orders(id),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
  } catch (error) {
    console.log(error);
  }
})();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
