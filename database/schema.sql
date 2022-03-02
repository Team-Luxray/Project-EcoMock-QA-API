CREATE TABLE products (
  id int not null primary key,
);

CREATE TABLE questions_csv (
  id int not null primary key,
  product_id int references products(id),
  body varchar(1000),
  date_written bigint,
  asker_name varchar(50),
  asker_email varchar(62),
  reported smallint,
  helpful int
);

CREATE TABLE questions (
  id int not null primary key,
  product_id int references products(id),
  body varchar(1000),
  date_written bigint,
  asker_name varchar(50),
  asker_email varchar(62),
  reported bool,
  helpful int
);

CREATE TABLE answers_csv (
  id int not null primary key,
  question_id int references questions(id),
  body varchar(1000),
  date_written bigint,
  answerer_name varchar(50),
  answerer_email varchar(62),
  reported smallint,
  helpful int
);

CREATE TABLE answers (
  id int not null primary key,
  question_id int references questions(id),
  body varchar(1000),
  date_written timestamp,
  answerer_name varchar(50),
  answerer_email varchar(62),
  reported bool,
  helpful int
);

CREATE TABLE photos (
  id int not null primary key,
  answer_id int references answers(id),
  url varchar(2083)
);