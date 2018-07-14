insert into foodLocations
(name, user_id)
values (${foodLocation}, ${id})

returning *;