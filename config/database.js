import mysql2 from "mysql2";

// Os dados de acesso vêm do arquivo .env (local) ou das Environment Variables da Vercel.
const database = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default database;
