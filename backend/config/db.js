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

module.exports = getConnection;
