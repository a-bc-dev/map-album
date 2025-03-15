const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");

// Helper function to validate maps data
function validateMapData(name, description, privacy, idUser) {
    if (!name || !privacy || !idUser) {
        return "Missing required fields: name, privacy, idUser";
    }

    if (name.length < 3 || name.length > 255) {
        return "Name must be between 3 and 255 characters";
    }

    if (description && description.length > 1000) {
        return "Description must be less than 1000 characters";
    }

    const validPrivacyOptions = ["public", "private"];
    if (!validPrivacyOptions.includes(privacy)) {
        return "Privacy must be 'public' or 'private'";
    }

    if (isNaN(idUser) || idUser < 1) {
        return "idUser must be a valid positive number";
    }

    return null;
}

// GET all maps with pagination
router.get("/", async (req, res) => {
    try {
        const connection = await getConnection();
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const [totalResults] = await connection.query(`SELECT COUNT(*) AS total FROM maps;`);
        const total = totalResults[0].total;

        const [results] = await connection.query(`SELECT * FROM maps LIMIT ? OFFSET ?;`, [limit, offset]);
        await connection.end();

        res.json({
            success: true,
            info: { total, page, limit, totalPages: Math.ceil(total / limit) },
            results,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET a single map
router.get("/:idMap", async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query(`SELECT * FROM maps WHERE idMap = ?;`, [req.params.idMap]);
        await connection.end();

        if (results.length === 0) return res.status(404).json({ success: false, message: "Map not found" });

        res.json({ success: true, result: results[0] });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST a new map
router.post("/", async (req, res) => {
    try {
        const { name, description, privacy, idUser } = req.body;
        const validationError = validateMapData(name, description, privacy, idUser);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO maps (name, description, privacy, idUser) VALUES (?, ?, ?, ?);`,
            [name, description, privacy, idUser]
        );

        await connection.end();
        res.json({ success: true, idMap: result.insertId });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT (update) a map
router.put("/:idMap", async (req, res) => {
    try {
        const { name, description, privacy, idUser } = req.body;
        const { idMap } = req.params;

        const validationError = validateMapData(name, description, privacy, idUser);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();
        const [result] = await connection.execute(
            `UPDATE maps SET name = ?, description = ?, privacy = ?, idUser = ? WHERE idMap = ?;`,
            [name, description, privacy, idUser, idMap]
        );

        await connection.end();
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Map not found" });

        res.json({ success: true, message: "Map updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE a map
router.delete("/:idMap", async (req, res) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.execute(`DELETE FROM maps WHERE idMap = ?;`, [req.params.idMap]);
        await connection.end();

        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Map not found" });

        res.json({ success: true, message: "Map deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;


