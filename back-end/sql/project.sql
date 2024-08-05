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
    kdc_id           INT          NOT NULL REFERENCES kdc_sub (id),
    isbn             VARCHAR(13)  NOT NULL UNIQUE,
    title            VARCHAR(255) NOT NULL,
    author           VARCHAR(100) NOT NULL,
    publisher        VARCHAR(100) NOT NULL,
    publication_year VARCHAR(4),
    description      TEXT,
    quantity         INT          NOT NULL DEFAULT 1,
    inserted         DATETIME     NOT NULL DEFAULT NOW()
);
CREATE TABLE kdc_main
(
    id         INT PRIMARY KEY,
    class_code VARCHAR(10) NOT NULL,
    name       VARCHAR(20) NOT NULL
);
CREATE TABLE kdc_sub
(
    kdc_main_id INT         NOT NULL REFERENCES kdc_main (id),
    id          INT PRIMARY KEY,
    class_code  VARCHAR(10) NOT NULL,
    name        VARCHAR(50) NOT NULL
);
CREATE TABLE book_image1
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT          NOT NULL REFERENCES book (id),
    name    VARCHAR(255) NOT NULL
);
CREATE TABLE book_transactions
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    book_id   INT      NOT NULL REFERENCES book (id),
    member_id INT      NOT NULL REFERENCES member (id),
    changes   INT      NOT NULL,
    updated   DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE book_loan
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    member_id   INT  NOT NULL REFERENCES member (id),
    book_id     INT  NOT NULL REFERENCES book (id),
    loan_date   DATE NOT NULL DEFAULT CURDATE(),
    due_date    DATE NOT NULL DEFAULT (CURDATE() + INTERVAL 7 DAY),
    return_date DATE
);