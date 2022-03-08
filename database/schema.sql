-- create database
CREATE DATABASE questions_answers;

-- create raw data and processed data tables
CREATE TABLE products_csv (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price MONEY
);

CREATE TABLE products (
product_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
product_name TEXT
);

CREATE TABLE questions_csv (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id INT REFERENCES products_csv(id),
  body TEXT,
  date_written BIGINT,
  asker_name TEXT,
  asker_email TEXT,
  reported SMALLINT,
  helpful INT
);

CREATE TABLE questions (
  question_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id INT REFERENCES products(product_id),
  question_body VARCHAR(1000),
  question_date_written TIMESTAMP,
  asker_name VARCHAR(50),
  asker_email VARCHAR(62),
  question_reported SMALLINT,
  question_helpful INT
);

CREATE TABLE answers_csv (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  question_id INT REFERENCES questions_csv(id),
  body TEXT,
  date_written BIGINT,
  answerer_name TEXT,
  answerer_email TEXT,
  reported SMALLINT,
  helpful INT
);

CREATE TABLE answers (
  answer_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  question_id INT REFERENCES questions(question_id),
  answer_body VARCHAR(1000),
  answer_date_written TIMESTAMP,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(62),
  answer_reported SMALLINT,
  answer_helpful INT
);

CREATE TABLE photos_csv (
  id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  answer_id INT REFERENCES answers_csv(id),
  url TEXT
);

CREATE TABLE photos (
  photo_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  answer_id INT REFERENCES answers(answer_id),
  photo_url VARCHAR(2083)
);

-- add CSV data to raw data tables
COPY products_csv(id, name, slogan, description, category, default_price)
FROM '/Users/samanthapham/Documents/hack_reactor/sdc-samantha/product.csv'
DELIMITER ','
CSV HEADER;

COPY questions_csv(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/Users/samanthapham/Documents/hack_reactor/sdc-samantha/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers_csv(id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/Users/samanthapham/Documents/hack_reactor/sdc-samantha/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos_csv(id, answer_id, url)
FROM '/Users/samanthapham/Documents/hack_reactor/sdc-samantha/answers_photos.csv'
DELIMITER ','
CSV HEADER;

-- insert transformed raw data INTo processed data tables
INSERT INTO products (product_name)
SELECT name
FROM products_csv;

INSERT INTO questions (product_id, question_body, question_date_written, asker_name, asker_email, question_reported, question_helpful)
SELECT product_id, body, to_timestamp(date_written / 1000), asker_name, asker_email, reported, helpful
FROM questions_csv;

ALTER TABLE questions
ALTER COLUMN question_reported TYPE BOOLEAN
USING CASE WHEN question_reported = 0 THEN FALSE
WHEN question_reported = 1 THEN TRUE
ELSE NULL
END;

INSERT INTO answers (question_id, answer_body, answer_date_written, answerer_name, answerer_email, answer_reported, answer_helpful)
SELECT question_id, body, to_timestamp(date_written / 1000), answerer_name, answerer_email, reported, helpful
FROM answers_csv;

ALTER TABLE answers
ALTER COLUMN answer_reported TYPE BOOLEAN
USING CASE WHEN answer_reported = 0 THEN FALSE
WHEN answer_reported = 1 THEN TRUE
ELSE NULL
END;

INSERT INTO photos (answer_id, photo_url)
SELECT answer_id, url
FROM photos_csv;

-- create fk index for question_id on answers table
CREATE INDEX answers_question_id_idx ON answers (question_id);

-- create fk index for answer_id on photos table
CREATE INDEX photos_answer_id_idx ON photos (answer_id);