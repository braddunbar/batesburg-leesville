alter table entities
add column owner_id integer not null;

alter table entities
add constraint entities_owner_id_fk
foreign key (owner_id) references users (id);
