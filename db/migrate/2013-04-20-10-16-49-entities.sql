create table entities (
  id serial primary key,
  name varchar(50) not null,
  check (name <> '')
);
