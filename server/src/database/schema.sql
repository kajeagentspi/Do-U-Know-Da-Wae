DROP USER IF EXISTS 'dukdw'@'localhost';
CREATE USER 'dukdw'@'localhost' IDENTIFIED BY 'dukdw';

DROP DATABASE IF EXISTS dukdw;
CREATE DATABASE dukdw;

GRANT SUPER ON *.* TO 'dukdw'@'localhost';
GRANT ALL PRIVILEGES ON dukdw.* TO 'dukdw'@'localhost';
