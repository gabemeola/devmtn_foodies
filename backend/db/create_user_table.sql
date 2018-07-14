create table if not exists users (
  id serial primary key,
  user_name varchar(40),
  email varchar(40),
  auth_id varchar(40)
)