CREATE DATABASE blogViajes;

USE blogViajes;

CREATE TABLE post(
    id int AUTO_INCREMENT PRIMARY KEY,
    title varchar(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author varchar(50),
    img TEXT
)


