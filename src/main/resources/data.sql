INSERT INTO courses (id, title, description, price) VALUES

(1, 'Java Full Stack Basics', 'Spring Boot, React, REST and MySQL fundamentals', 499),
(2, 'React for Beginners', 'Components, state, forms and APT calls.', 299),
(3, 'SQL Essentials', 'Practical MySQL querying and schema basics.', 199)
ON DUPLICATE KEY UPDATE
title = VALUES(title),
description = VALUES(description),
price = VALUES(price);