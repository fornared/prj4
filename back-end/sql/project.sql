USE prj4;

CREATE TABLE member
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name     VARCHAR(20)  NOT NULL,
    tel      VARCHAR(20)  NOT NULL,
    address  VARCHAR(255) NOT NULL,
    gender   INT(1)       NOT NULL,
    birth    DATE         NOT NULL,
    inserted DATETIME     NOT NULL DEFAULT NOW()
);

CREATE TABLE member_authority
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT         NOT NULL REFERENCES member (id),
    name      VARCHAR(10) NOT NULL
);

CREATE TABLE book
(
    id               INT PRIMARY KEY AUTO_INCREMENT,
    category_id      INT          NOT NULL REFERENCES category (id),
    title            VARCHAR(255) NOT NULL,
    author           VARCHAR(100) NOT NULL,
    publisher        VARCHAR(100) NOT NULL,
    publication_year VARCHAR(4),
    isbn             VARCHAR(13)  NOT NULL,
    description      TEXT,
    inserted         DATETIME     NOT NULL DEFAULT NOW()
);
CREATE TABLE category
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
CREATE TABLE book_image
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL REFERENCES book (id),
    name    VARCHAR(255),
    url     VARCHAR(1024)
);
