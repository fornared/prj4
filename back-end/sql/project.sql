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