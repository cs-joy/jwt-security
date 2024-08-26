CREATE DATABASE jwt_security;
CREATE USER 'zsecurity'@'localhost' IDENTIFIED BY 'zsecurity';
GRANT ALL PRIVILEGES ON jwt_security.* TO 'zsecurity'@'localhost';
FLUSH PRIVILEGES;