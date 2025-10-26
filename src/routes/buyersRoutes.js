const express = require("express");
const pool = require("../db");
const { route } = require("./authRoutes");

const router = express.Router();

// Create new buyer
router.post("/", async (req, res) => {
  try {
    const { name, address, contact_no } = req.body;

    const result = await pool.query(
      `INSERT INTO buyers(name, address, contact_no) VALUES($1, $2, $3) RETURNING *`,
      [name, address, contact_no]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add buyer." });
  }
});

// Get all buyers
router.get("/", async (req, res) => {
  try {
    const buyers = await pool.query(`SELECT * FROM buyers`);

    res.json(buyers.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get buyers." });
  }
});

//  Get single buyer
router.get("/:id", async (req, res) => {
  try {
    const buyer = await pool.query(`SELECT * FROM buyers WHERE id = $1`, [
      req.params.id,
    ]);

    res.json(buyer.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get buyer." });
  }
});

// Update buyer
router.put("/:id", async (req, res) => {
  const { name, address, contact_no } = req.body;
  try {
    const buyer = await pool.query(
      `UPDATE buyers SET name=$1, address=$2, contact_no=$3 WHERE id=$4 RETURNING *`,
      [name, address, contact_no, req.params.id]
    );

    res.json(buyer.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get buyer." });
  }
});

// Delete buyer
router.delete("/:id", async (req, res) => {
  try {
    const buyer = await pool.query(
      `DELETE FROM buyers WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json(buyer.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to delete buyer." });
  }
});

// Get buyer's orders
router.get("/:id/orders", async (req, res) => {
  try {
    const orders = await pool.query(
      `SELECT * FROM orders WHERE buyer_id = $1`,
      [req.params.id]
    );

    res.json(orders.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get buyer's orders." });
  }
});

module.exports = router;
