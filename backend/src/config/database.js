import mysql2 from "mysql2";

const database = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "aluno_projetos",
    password: "aluno@projeto",
    database: "aluno_projetos_maturebox_db"
});

export default database;
