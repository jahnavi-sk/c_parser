drop database parsi;
create database parsi;
use parsi;


CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    srn VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at timestamp default current_timestamp,
    graded boolean default false
);

CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    srn VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_content TEXT,
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks INT,
    FOREIGN KEY (srn) REFERENCES students(srn) ON DELETE CASCADE
);

CREATE TABLE datatypes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    isBuiltIn BOOLEAN,
    isMacro BOOLEAN,
    submissionID INT,
    FOREIGN KEY (submissionID) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE TABLE libraries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    fileRef VARCHAR(255),
    submissionID INT,
    FOREIGN KEY (submissionID) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE TABLE files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    submissionID INT,
    FOREIGN KEY (submissionID) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE TABLE variables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    initialValue VARCHAR(255),
    scope ENUM('local', 'global'),
    dataTypeID INT,
    fileRef VARCHAR(255),
    submissionID INT,
    FOREIGN KEY (dataTypeID) REFERENCES datatypes(id),
    FOREIGN KEY (submissionID) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE TABLE func (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    initialLine INT,
    numberOfParameters INT,
    returnTypeID INT,
    fileRef VARCHAR(255),
    submissionID INT,
    FOREIGN KEY (returnTypeID) REFERENCES datatypes(id),
    FOREIGN KEY (submissionID) REFERENCES submissions(id) ON DELETE CASCADE
);


CREATE TABLE controlStructure (
    id INT PRIMARY KEY AUTO_INCREMENT,
    structureType VARCHAR(255),
    cond TEXT,
    parentFunctionID INT,
    lineNumber INT,
    fileRef VARCHAR(255),
    submissionID INT,
    FOREIGN KEY (parentFunctionID) REFERENCES func(id),
    FOREIGN KEY (submissionID) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE TABLE teachers (
    id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE SubmissionDeadline (
    DeadlineTime DATETIME NOT NULL
);



-- Trigger
DELIMITER $$
CREATE TRIGGER PreventLateSubmissions
BEFORE INSERT ON submissions
FOR EACH ROW
BEGIN
    DECLARE DeadlineT DATETIME;
    SELECT DeadlineTime INTO DeadlineT FROM SubmissionDeadline LIMIT 1;
    IF DeadlineT IS NOT NULL AND NOW() > DeadlineT THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Submission deadline has passed. No new submissions allowed.';
    END IF;
END $$

DELIMITER ;


-- Procedure
DELIMITER $$

CREATE PROCEDURE SetSubmissionDeadline(IN DeadlineTime DATETIME)
BEGIN
    DELETE FROM SubmissionDeadline;
    INSERT INTO SubmissionDeadline (DeadlineTime)
    VALUES (DeadlineTime);
END $$

DELIMITER ;



-- Roles and Grants
CREATE USER 'teacher'@'localhost' IDENTIFIED BY 't123';
CREATE USER 'student'@'localhost' IDENTIFIED BY 's123';
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'a123';

-- Grants privileges for the admin user (full access)
GRANT ALL PRIVILEGES ON parsi.* TO 'admin'@'localhost';

-- Grants privileges to teachers
GRANT SELECT ON parsi.* TO 'teacher'@'localhost';
GRANT UPDATE ON parsi.students TO 'teacher'@'localhost';
GRANT EXECUTE ON PROCEDURE parsi.SetSubmissionDeadline TO 'teacher'@'localhost';
GRANT SELECT, INSERT ON parsi.submissions TO 'teacher'@'localhost';
GRANT UPDATE ON parsi.submissions TO 'teacher'@'localhost';
GRANT DELETE ON parsi.submissions TO 'teacher'@'localhost';

--Grants priviliges to students
GRANT SELECT,INSERT ON parsi.students TO 'student'@'localhost';
GRANT INSERT ON parsi.submissions TO 'student'@'localhost';

CREATE VIEW student_submissions AS
SELECT * FROM submissions 
WHERE srn = SUBSTRING_INDEX(CURRENT_USER(), '@', 1);
GRANT SELECT ON parsi.student_submissions TO 'student'@'localhost';

GRANT DELETE ON parsi.SubmissionDeadline TO 'teacher'@'localhost';
GRANT INSERT ON parsi.SubmissionDeadline TO 'teacher'@'localhost';

-- Apply the privileges
FLUSH PRIVILEGES;

