create table tasks (
	"id" serial primary key,
	"taskname" varchar(64) not null,
	"taskdesc" varchar(256) not null,
	"subtasks" varchar(1024),
	"timecomplete" timestamp
	);
	
insert into tasks (taskname, taskdesc, subtasks)
values ('Dishes','Do all the dishes, yes even those ones',null),
('Trash', 'Take out the trash, yes even that trash','Living room:f|Bedroom:f|Kitchen:f');