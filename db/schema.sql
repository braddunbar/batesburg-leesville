
create table if not exists users (
  id serial primary key,
  email varchar(254) not null
);
