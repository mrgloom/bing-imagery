create database bit_detections;
create user 'bit' identified by 'qwerty';
grant all privileges on bit_detections.* to 'bit';

USE bit_detections;
CREATE TABLE images
(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	cube_id int NOT NULL,
	lat decimal(8,5),
	lon decimal(8,5),
	direction tinyint,
	zoom_1_coord tinyint,
	zoom_2_coord tinyint,
	zoom_3_coord tinyint,
	zoom_4_coord tinyint,
	detector_ran boolean
);

CREATE TABLE image_detection_runs
(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	image_id int NOT NULL,
	detection_type varchar(50) NOT NULL
);

CREATE INDEX cube_id_index
ON images (cube_id);

CREATE TABLE detections (
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	image_id int NOT NULL,
	detection_type varchar(50) NOT NULL,
	x_min int,
	x_max int,
	y_min int,
	y_max int,
INDEX img_id (image_id),
FOREIGN KEY (image_id)
  REFERENCES images(id)
  ON DELETE CASCADE
);
