create table tasks (
	"id" serial primary key,
	"taskname" varchar(64) not null,
	"taskdesc" varchar(256) not null,
	"subtasks" varchar(1024) not null,
	"timecomplete" timestamp
	);
	
insert into tasks (taskname, taskdesc, complete)
values ('Dishes','Do all the dishes, yes even those ones','',false),
('Trash', 'Take out the trash, yes even that trash','living room:f|bedroom:f|kitchen:f', false);