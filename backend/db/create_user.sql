insert into users 
(user_name, email, auth_id)
values (${user_name}, ${email}, ${auth_id})

returning *;