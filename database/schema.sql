-- Estrutura esperada da tabela de usuários (banco aluno_projetos_maturebox_db)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

ALTER TABLE usuarios 
ADD COLUMN verificado TINYINT(1) DEFAULT 0,
ADD COLUMN token_verificacao VARCHAR(255);

ALTER TABLE usuarios ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE;