CREATE TABLE users(
   uid BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   displayName VARCHAR(50),
   photoURL VARCHAR(40),
   email VARCHAR(50),
   emailVerified BOOLEAN,
   lastLoginAt DATE,
   createdAt DATE
);

CREATE TABLE plan(
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   motivationStatement TEXT,
   createdDate DATETIME,
   lastUpdatedDate DATETIME
);

CREATE TABLE goal(
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   type VARCHAR(20),
   name VARCHAR(200),
   unit VARCHAR(20),
   value BIGINT,
   createdDate DATETIME,
   lastUpdatedDate DATETIME
);

CREATE TABLE result(
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   date DATETIME,
   type VARCHAR(20),
   subtype VARCHAR(20),
   name VARCHAR(200),
   unit VARCHAR(20),
   value BIGINT,
   createdDate DATETIME,
   lastUpdatedDate DATETIME
);

ALTER TABLE plan ADD FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;
ALTER TABLE goal ADD FOREIGN KEY (planId) REFERENCES plan(id) ON DELETE CASCADE;
ALTER TABLE result ADD FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;
