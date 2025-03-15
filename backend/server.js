// Import libraries

const express = require('express');
const cors = require('cors');
require("dotenv").config();
const mysql = require("mysql2/promise");

async function getConnection() {
    const connectionData = {
        host: process.env["MYSQL_HOST"],
        port: process.env["MYSQL_PORT"],
        user: process.env["MYSQL_USER"],
        password: process.env["MYSQL_PASS"],
        database: process.env["MYSQL_SCHEMA"],
    };
    const connection = await mysql.createConnection(connectionData);
    await connection.connect();

    return connection;
}

//Server configuration

const app = express();
app.use(cors());
app.use(express.json());

//Launch the server

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port <http://localhost:${port}>`);
});

//First endpoint
app.get("/maps", async (req, res) => {

    const connection = await getConnection();

    const [results] = await connection.query(`SELECT * FROM maps;`);

    await connection.end();

    const numberOfElements = results.length;

    res.json({
        info: { count: numberOfElements },
        results: results,
    });
});


app.get("/maps/:idMap", async (req, res) => {

    const connection = await getConnection();

    const [results] = await connection.query(`
        SELECT * 
            FROM maps
            WHERE idMap = ?;`, [req.params.idMap]);

    await connection.end();

    res.json(
         results[0]
        );
});

app.post('/maps', async (req, res) => {
    try {
        const { name, description, privacy, idUser } = req.body;

        // Basic Validation: Check if required fields are present
        if (!name || !privacy || !idUser) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, privacy, idUser"
            });
        }

        // Field Length Validation
        if (name.length < 3 || name.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 3 and 255 characters"
            });
        }

        if (description && description.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Description must be less than 1000 characters"
            });
        }

        // Allowed Values for ENUM fields
        const validPrivacyOptions = ["public", "private"];
        if (!validPrivacyOptions.includes(privacy)) {
            return res.status(400).json({
                success: false,
                message: "Privacy must be 'public' or 'private'"
            });
        }

        // Ensure idUser is a valid number
        if (isNaN(idUser) || idUser < 1) {
            return res.status(400).json({
                success: false,
                message: "idUser must be a valid positive number"
            });
        }

        const connection = await getConnection();

        const [results] = await connection.execute(
            `INSERT INTO maps (name, description, privacy, idUser) 
             VALUES (?, ?, ?, ?);`,
            [name, description, privacy, idUser]
        );

        await connection.end();

        res.json({
            success: true,
            idMap: results.insertId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error inserting map.",
            error: error.message
        });
    }
});


app.put('/maps/:idMap', async (req, res) => {
    try {
        const { name, description, privacy, idUser } = req.body;
        const { idMap } = req.params;

        // Basic Validation: Check if required fields are present
        if (!name || !privacy || !idUser) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, privacy, idUser"
            });
        }

        // Field Length Validation
        if (name.length < 3 || name.length > 255) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 3 and 255 characters"
            });
        }

        if (description && description.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Description must be less than 1000 characters"
            });
        }

        // Allowed Values for ENUM fields
        const validPrivacyOptions = ["public", "private"];
        if (!validPrivacyOptions.includes(privacy)) {
            return res.status(400).json({
                success: false,
                message: "Privacy must be 'public' or 'private'"
            });
        }

        // Ensure idUser and idMap are valid numbers
        if (isNaN(idUser) || idUser < 1 || isNaN(idMap) || idMap < 1) {
            return res.status(400).json({
                success: false,
                message: "idUser and idMap must be valid positive numbers"
            });
        }

        const connection = await getConnection();

        const [results] = await connection.execute(
            `UPDATE maps 
             SET name = ?, description = ?, privacy = ?, idUser = ? 
             WHERE idMap = ?;`,
            [name, description, privacy, idUser, idMap]
        );

        await connection.end();

        if (results.affectedRows === 1) {
            res.json({
                success: true,
                message: "Map updated successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Map not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating map.",
            error: error.message
        });
    }
});


app.delete("/maps/:idMap", async (req, res) => {
    try {
        const connection = await getConnection();

        const [result] = await connection.execute(
            `DELETE FROM maps WHERE idMap = ?;`,
            [req.params.idMap]
        );

        await connection.end();

        if (result.affectedRows === 1) {
            res.json({
                success: true,
                message: "Map deleted successfully.",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Map not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting the map.",
            error: error.message,
        });
    }
});


