INSERT INTO employees (email, password, name, role, phone)
VALUES ('avaneeshkarthik.s@gmail.com',  SHA2('ava', 256), 'Site Admin', 'admin', ' +91-9000000001');

INSERT INTO employees (email, password, name, role, phone)
VALUES ('employee@example.com', SHA2('EmpPass!23', 256), 'Demo Employee', 'employee', '+91-9000000002');

INSERT INTO employees (email, password, name, role, phone)
VALUES ('content@example.com',  SHA2('ContentPass!23', 256), 'Content Manager', 'content_manager', '+91-9000000003');

INSERT INTO employees (email, password, name, role, phone)
VALUES ('hr@example.com',       SHA2('HRPass!23', 256), 'HR Lead', 'hr', '+91-9000000004');

INSERT INTO employees (email, password, name, role, phone)
VALUES ('support@example.com',  SHA2('SupportPass!23', 256), 'Support Rep', 'support', '+91-9000000005');