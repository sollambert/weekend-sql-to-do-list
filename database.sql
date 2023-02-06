create table tasks (
	"id" serial primary key,
	"taskname" varchar(60) not null,
	"taskdesc" varchar(255) not null,
	"subtasks" text(1000),
	"timecomplete" timestamp
	);
	
insert into tasks (taskname, taskdesc, subtasks)
values ('Dishes','Do all the dishes, yes even those ones',null),
('Trash', 'Take out the trash, yes even that trash','Living room:f|Bedroom:f|Kitchen:f');