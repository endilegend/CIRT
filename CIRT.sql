CREATE DATABASE CIRT;
USE CIRT;

CREATE TABLE users (
    user_role ENUM('Reviewer', 'Author', 'Viewer') DEFAULT 'Author' NOT NULL,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    id VARCHAR(250) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE article (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pdf_path VARCHAR(255) NOT NULL,  -- storing the file path instead of the PDF content
    author_id VARCHAR(250),
    status ENUM('Sent', 'Under Review', 'Approved', 'Declined'),
    type ENUM('Article', 'Journal', 'Poster', 'Paper'),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT,
    keyword VARCHAR(50) NOT NULL,
    FOREIGN KEY (article_id) REFERENCES article(id)
);
