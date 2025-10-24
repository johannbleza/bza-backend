const express = require("express");
const pool = require("../db");

const router = express.Router();

// Creat new item
router.post("/", async (req, res) => {
  try {
    const { name, source, original_price, selling_price, status, order_id } =
      req.body;

    const item = await pool.query(
      `INSERT INTO items(name, source, original_price, selling_price, status, order_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, source, original_price, selling_price, status, order_id]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add item." });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await pool.query(`SELECT * FROM items`);
    res.json(items.rows);
  } catch (error) {
    console.log(error);
    res.send(500).json({ message: "Failed to fetch items." });
  }
});

// Get single item
router.get("/:id", async (req, res) => {
  try {
    const items = await pool.query(`SELECT * FROM items WHERE id = $1`, [
      req.params.id,
    ]);
    res.json(items.rows);
  } catch (error) {
    console.log(error);
    res.send(500).json({ message: "Failed to fetch items." });
  }
});

// Update item
router.put("/:id", async (req, res) => {
  try {
    const { name, source, original_price, selling_price, status, order_id } =
      req.body;

    const item = await pool.query(
      `UPDATE items SET name=$1, source=$2, original_price=$3, selling_price=$4, status=$5, order_id=$6 WHERE id=$7 RETURNING *`,
      [
        name,
        source,
        original_price,
        selling_price,
        status,
        order_id,
        req.params.id,
      ]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update item." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await pool.query(
      `DELETE FROM items WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json(item.rows[0]);
  } catch (error) {
    console.log(error);
    res.send(500).json({ message: "Failed to delete item." });
  }
});
module.exports = router;
