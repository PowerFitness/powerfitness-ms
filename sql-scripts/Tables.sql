CREATE TABLE plan(
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   userUniqueId VARCHAR(32),
   motivationStatement TEXT,
   createdDate DATETIME,
   lastUpdatedDate DATETIME
);

CREATE TABLE goal(
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   planId BIGINT,
   FOREIGN KEY (planId) REFERENCES plan(id),
   type VARCHAR(50),
   name VARCHAR(200),
   unit VARCHAR(20),
   value INT,
   createdDate DATETIME,
   lastUpdatedDate DATETIME
);

CREATE TABLE result(
   id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   userUniqueId VARCHAR(32),
   date DATE,
   type VARCHAR(50),
   subtype VARCHAR(20),
   name VARCHAR(200),
   unit VARCHAR(20),
   value INT,
   createdDate DATETIME,
   lastUpdatedDate DATETIME
);