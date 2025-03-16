CREATE DATABASE CIRT;

-- ENUM types:
CREATE TYPE user_role AS ENUM ('Reviewer', 'Author', 'Viewer');
CREATE TYPE article_status AS ENUM ('Sent', 'Under Review', 'Approved', 'Declined');
CREATE TYPE article_type AS ENUM ('Article', 'Journal', 'Poster', 'Paper');

CREATE TABLE users (
                       user_role user_role DEFAULT 'Author' NOT NULL,
                       f_name VARCHAR(50) NOT NULL,
                       l_name VARCHAR(50) NOT NULL,
                       id VARCHAR(250) PRIMARY KEY,
                       email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE article (
                         id SERIAL PRIMARY KEY,
                         pdf_file BYTEA NOT NULL,
                         author_id VARCHAR(250),
                         status article_status,
                         type article_type,
                         FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE keywords (
                          id SERIAL PRIMARY KEY,
                          article_id INT,
                          keyword VARCHAR(50) NOT NULL,
                          FOREIGN KEY (article_id) REFERENCES article(id)
);
