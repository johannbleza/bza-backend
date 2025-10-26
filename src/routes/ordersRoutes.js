const express = require("express");
const pool = require("../db");

const router = express.Router();

// Create new order
router.post("/", async (req, res) => {
  try {
    const { buyer_id, status } = req.body;

    const result = await pool.query(
      `INSERT INTO orders(buyer_id, status) VALUES($1, $2) RETURNING *`,
      [buyer_id, status]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add order." });
  }
});

// Get all orders with details
router.get("/", async (req, res) => {
  try {
    const orders = await pool.query(`SELECT * FROM orders`);
    res.json(orders.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get orders." });
  }
});

// Get single order with details
router.get("/:id", async (req, res) => {
  try {
    const order = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
      req.params.id,
    ]);

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get order." });
  }
});

// Update order
router.put("/:id", async (req, res) => {
  const { buyer_id, status } = req.body;
  try {
    const order = await pool.query(
      `UPDATE orders SET buyer_id=$1, status=$2 WHERE id=$3 RETURNING *`,
      [buyer_id, status, req.params.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update order." });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM orders WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to delete order." });
  }
});

// Get items of a specific order
router.get("/:id/items", async (req, res) => {
  try {
    const items = await pool.query(`SELECT * FROM items WHERE order_id = $1`, [
      req.params.id,
    ]);

    res.json(items.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get order items." });
  }
});

module.exports = router;
