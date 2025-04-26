
// Define user roles for random assignment
export const USER_ROLES = [
  'Developer', 'Designer', 'Manager', 'Product Owner', 'QA Engineer', 'DevOps', 'UX Researcher', 'Data Scientist', 'Technical Writer',
  'System Administrator', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'Cloud Architect',
  'Database Administrator', 'Security Engineer', 'Network Engineer', 'Business Analyst', 'Scrum Master', 'Project Manager',
  'CTO', 'CEO', 'CFO', 'CIO', 'CISO',
  'VP of Engineering', 'Director of Product', 'Marketing Specialist', 'Content Strategist', 'SEO Specialist', 'Customer Support',
  'HR Manager', 'IT Support', 'Sales Representative', 'Account Executive', 'Operations Manager', 'UI Designer', 'Blockchain Developer',
  'Machine Learning Engineer', 'AR/VR Developer', 'Game Developer', 'Site Reliability Engineer', 'Quality Assurance Lead',
  'Compliance Officer', 'Legal Counsel', 'Community Manager', 'Product Marketing Manager', 'Growth Hacker', 'Accessibility Specialist'
];

// Define first names for generation
export const FIRST_NAMES = [
  'John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa', 'Thomas',
  'Jessica', 'Daniel', 'Jennifer', 'Matthew', 'Olivia', 'Christopher',
  'Emma', 'Andrew', 'Sophia', 'James', 'Isabella', 'Joshua', 'Mia', 'Ryan',
  'Charlotte', 'Tyler', 'Amelia', 'Alexander', 'Abigail', 'William', 'Elizabeth',
  'Liam', 'Ava', 'Noah', 'Evelyn', 'Ethan', 'Harper', 'Mason', 'Camila',
  'Logan', 'Aria', 'Lucas', 'Ella', 'Jackson', 'Scarlett', 'Benjamin', 'Grace',
  'Aiden', 'Chloe', 'Henry', 'Victoria', 'Samuel', 'Madison', 'Sebastian', 'Luna',
  'Jack', 'Penelope', 'Owen', 'Layla', 'Gabriel', 'Riley', 'Carter', 'Zoey',
  'Jayden', 'Nora', 'Mateo', 'Lily', 'Wyatt', 'Eleanor', 'Dylan', 'Hannah',
  'Grayson', 'Lillian', 'Isaiah', 'Addison', 'Leo', 'Aubrey', 'Julian', 'Ellie',
  'Ezra', 'Stella', 'Lincoln', 'Natalie', 'Jaxon', 'Zoe', 'Adam', 'Leah',
  'Jose', 'Hazel', 'Asher', 'Violet', 'Anthony', 'Aurora', 'Muhammad', 'Savannah',
  'Cameron', 'Audrey', 'Caleb', 'Brooklyn', 'Nathan', 'Bella', 'Adrian', 'Claire',
  'Christian', 'Skylar', 'Maverick', 'Lucy', 'Dominic', 'Paisley', 'Eli', 'Everly',
  'Aaron', 'Anna', 'Landon', 'Caroline', 'Colton', 'Nova', 'Jonathan', 'Genesis',
  'Hunter', 'Emilia', 'Santiago', 'Kennedy', 'Axel', 'Samantha', 'Everett', 'Maya',
  'Ian', 'Willow', 'Jason', 'Kinsley', 'Diego', 'Naomi', 'Easton', 'Aaliyah',
  'Kai', 'Elena', 'Carson', 'Sarah', 'Xavier', 'Ariana', 'Zachary', 'Allison',
  'Cooper', 'Gabriella', 'Parker', 'Alice', 'Roman', 'Madelyn', 'Josiah', 'Cora',
  'Beau', 'Ruby', 'Hudson', 'Eva', 'Evan', 'Serenity', 'Malachi', 'Autumn',
  'Adam', 'Adeline', 'Ezekiel', 'Hailey', 'Miles', 'Gianna', 'Declan', 'Valentine',
  'Weston', 'Josephine', 'Silas', 'Delilah', 'Brody', 'Nevaeh', 'Micah', 'Sadie',
  'Finn', 'Piper', 'Ryker', 'Lydia', 'Jameson', 'Alexa', 'Jasper', 'Raelynn',
  'Rhett', 'Julia', 'Oliver', 'Sophie', 'Edward', 'Clara', 'Omar', 'Taylor'
];

export const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
  'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
  'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez',
  'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young',
  'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams',
  'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips',
  'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores',
  'Morris', 'Nguyen', 'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan', 'Peterson',
  'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward',
  'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray',
  'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long', 'Foster',
  'Sanders', 'Ross', 'Morales', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins',
  'Gutierrez', 'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons',
  'Patterson', 'Jordan', 'Reynolds', 'Hamilton', 'Graham', 'Kim', 'Gonzales', 'Alexander',
  'Ramos', 'Wallace', 'Griffin', 'West', 'Cole', 'Hayes', 'Chavez', 'Gibson',
  'Bryant', 'Ellis', 'Stevens', 'Murray', 'Ford', 'Marshall', 'Owens', 'McDonald',
  'Harrison', 'Ruiz', 'Kennedy', 'Wells', 'Alvarez', 'Woods', 'Mendoza', 'Castillo',
  'Olson', 'Webb', 'Washington', 'Tucker', 'Freeman', 'Burns', 'Henry', 'Vasquez',
  'Snyder', 'Simpson', 'Crawford', 'Jimenez', 'Porter', 'Mason', 'Shaw', 'Gordon',
  'Wagner', 'Hunter', 'Romero', 'Hicks', 'Dixon', 'Hunt', 'Palmer', 'Robertson',
  'Black', 'Holmes', 'Stone', 'Meyer', 'Boyd', 'Mills', 'Warren', 'Fox',
  'Rose', 'Rice', 'Moreno', 'Schmidt', 'Patel', 'Ferguson', 'Nichols', 'Herrera',
  'Medina', 'Ryan', 'Fernandez', 'Weaver', 'Daniels', 'Stephens', 'Gardner', 'Payne',
  'Kelley', 'Dunn', 'Pierce', 'Arnold', 'Tran', 'Spencer', 'Peters', 'Hawkins',
  'Grant', 'Hansen', 'Castro', 'Hoffman', 'Hart', 'Elliott', 'Cunningham', 'Knight',
  'Bradley', 'Carroll', 'Hudson', 'Duncan', 'Armstrong', 'Berry', 'Andrews', 'Johnston',
  'Ray', 'Lane', 'Riley', 'Carpenter', 'Perkins', 'Aguilar', 'Silva', 'Richards',
  'Willis', 'Matthews', 'Chapman', 'Lawrence', 'Garza', 'Vargas', 'Watkins', 'Wheeler',
  'Larson', 'Carlson', 'Harper', 'George', 'Greene', 'Burke', 'Guzman', 'Morrison',
  'Munoz', 'Jacobs', 'Obrien', 'Lawson', 'Franklin', 'Lynch', 'Bishop', 'Carr',
  'Salazar', 'Austin', 'Mendez', 'Gilbert', 'Jensen', 'Williamson', 'Montgomery', 'Harvey'
];