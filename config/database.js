import mysql2 from "mysql2";

const database = mysql2.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT) || 3306
});

export default database;