---follow this file to create simple database with table and testing it in browser/
--postman, we use PostgreSQL

--Create Postgree database
CREATE DATABASE user_db;

--Create Postgree table
CREATE TABLE public.user (
	id serial primary key,
    f_name varchar(10),
    l_name varchar(10),
    birthday date,
    location varchar(20),
    gmt_offset varchar(10)
);
--Insert data
INSERT INTO public."user"
(id, f_name, l_name, birthday, "location", gmt_offset)
VALUES(5, 'Syaddad', 'Bahalwan', '1976-12-11', 'Surabaya', '+7');
INSERT INTO public."user"
(id, f_name, l_name, birthday, "location", gmt_offset)
VALUES(6, 'Yudo', 'Arianto', '1977-09-11', 'Melbourne', '+9.39');

--Testing with Postman

--get all
localhost:3000/user

--get one
localhost:3000/user/5

--insert/post
{
    "f_name": "Syaddad",
    "l_name": "Bahalwan",
    "birthday": "1976-12-11",
    "location": "Surabaya",
    "gmt_offset": "+7"
}

--update/put
{
    "location": "Darwin",
    "gmt_offset": "+9.39"
}

--delete
localhost:3000/user/5