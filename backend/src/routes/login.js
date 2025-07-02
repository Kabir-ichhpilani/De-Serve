const express = require('express');
const pool = require('../../db');

const router = express.Router();

// ➕ Add user with case-sensitive column names
router.post('/add', async (req, res) => {
    const { Email, PassWord } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO login (email, password) VALUES ($1, $2) RETURNING *',
            [Email, PassWord] // Keep camelCase in frontend
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Insert failed', reason: err.message });
    }
});



// ❌ Delete user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM login WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: `User with ID ${id} deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
