alter table entities
add column street varchar(250) not null default '';

alter table entities
add column city varchar(100) not null default '';

alter table entities
add column state char(2) not null default 'SC';

alter table entities
add column zip varchar(10) not null default '';

