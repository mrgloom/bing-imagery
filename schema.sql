CREATE TABLE images
(
	id int PRIMARY KEY NOT NULL,
	cube_id int NOT NULL,
	lat decimal,
	lon decimal,
	direction tinyint,
	zoom_1_coord tinyint,
	zoom_2_coord tinyint,
	zoom_3_coord tinyint,
	zoom_4_coord tinyint
);
CREATE INDEX cube_id_index
ON images (cube_id);

CREATE TABLE detections (
	id int PRIMARY KEY NOT NULL,
	image_id int NOT NULL,
	x_min int,
	x_max int,
	y_min int,
	y_max int
FOREIGN KEY (image_id) REFERENCES images(id)
);