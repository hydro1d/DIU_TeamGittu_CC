
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

// --- DATABASE CONNECTION ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;
try {
    pool = mysql.createPool(dbConfig);
    console.log("MySQL Connection Pool Created Successfully.");
} catch (error) {
    console.error("Failed to create MySQL Connection Pool:", error);
    process.exit(1);
}

// --- STATIC DATA (imported from original project files) ---
const JOBS = [
  { id: 'job-1', title: 'Frontend Developer', company: 'Tech Solutions Inc.', location: 'Remote', requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'], experienceLevel: 'Junior', jobType: 'Full-time', description: 'Join our team to build amazing user interfaces with React and TypeScript.' },
  { id: 'job-2', title: 'Backend Developer', company: 'Data Systems', location: 'New York, NY', requiredSkills: ['Node.js', 'Express', 'MySQL', 'REST APIs'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Design and implement scalable backend services and APIs.' },
  { id: 'job-3', title: 'UI/UX Designer', company: 'Creative Minds', location: 'San Francisco, CA', requiredSkills: ['Figma', 'Sketch', 'User Research', 'Prototyping'], experienceLevel: 'Junior', jobType: 'Part-time', description: 'Create intuitive and visually appealing designs for our mobile and web applications.' },
  { id: 'job-4', title: 'Data Analyst Intern', company: 'Innovatech', location: 'Remote', requiredSkills: ['SQL', 'Python', 'Pandas', 'Data Visualization'], experienceLevel: 'Fresher', jobType: 'Internship', description: 'Analyze data to find insights and support business decisions.' },
  { id: 'job-5', title: 'Digital Marketing Specialist', company: 'MarketPro', location: 'Austin, TX', requiredSkills: ['SEO', 'SEM', 'Google Analytics', 'Content Marketing'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Develop and execute digital marketing campaigns to drive growth.' },
  { id: 'job-6', title: 'Full-Stack Developer', company: 'Cloud Innovations', location: 'Remote', requiredSkills: ['React', 'Node.js', 'AWS', 'MongoDB'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Work on both frontend and backend parts of our cloud-based platform.' },
  { id: 'job-7', title: 'Product Manager', company: 'Visionary Apps', location: 'Seattle, WA', requiredSkills: ['Agile', 'Product Roadmapping', 'Market Analysis', 'Communication'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Define product vision, strategy, and roadmap for our flagship application.' },
  { id: 'job-8', title: 'DevOps Engineer', company: 'InfraWorks', location: 'Remote', requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Automate and manage our cloud infrastructure and deployment pipelines.' },
  { id: 'job-9', title: 'Graphic Design Freelancer', company: 'Creative Minds', location: 'Remote', requiredSkills: ['Adobe Illustrator', 'Adobe Photoshop', 'Branding'], experienceLevel: 'Junior', jobType: 'Freelance', description: 'Create compelling graphics for marketing materials and social media.' },
  { id: 'job-10', title: 'Data Scientist', company: 'Data Systems', location: 'New York, NY', requiredSkills: ['Machine Learning', 'Python', 'TensorFlow', 'Scikit-learn'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Build machine learning models to solve complex business problems.' },
  { id: 'job-11', title: 'React Native Developer', company: 'Mobile First', location: 'Remote', requiredSkills: ['React Native', 'JavaScript', 'iOS', 'Android'], experienceLevel: 'Junior', jobType: 'Full-time', description: 'Develop cross-platform mobile applications using React Native.' },
  { id: 'job-12', title: 'Content Writer', company: 'MarketPro', location: 'Remote', requiredSkills: ['Content Marketing', 'Copywriting', 'SEO', 'Communication'], experienceLevel: 'Junior', jobType: 'Part-time', description: 'Write engaging and SEO-friendly content for our blog and website.' },
  { id: 'job-13', title: 'QA Tester Intern', company: 'Tech Solutions Inc.', location: 'Remote', requiredSkills: ['Manual Testing', 'Bug Tracking', 'Attention to Detail'], experienceLevel: 'Fresher', jobType: 'Internship', description: 'Help ensure the quality of our software through manual testing and bug reporting.' },
  { id: 'job-14', title: 'Junior Python Developer', company: 'Innovatech', location: 'Austin, TX', requiredSkills: ['Python', 'Django', 'Flask', 'SQL'], experienceLevel: 'Junior', jobType: 'Full-time', description: 'Develop web applications and scripts using Python frameworks.' },
  { id: 'job-15', title: 'Social Media Manager', company: 'MarketPro', location: 'Remote', requiredSkills: ['Social Media Strategy', 'Content Creation', 'Community Management'], experienceLevel: 'Junior', jobType: 'Full-time', description: 'Manage and grow our social media presence across various platforms.' },
  { id: 'job-16', title: 'IT Support Specialist', company: 'Tech Solutions Inc.', location: 'New York, NY', requiredSkills: ['Troubleshooting', 'Customer Service', 'Networking'], experienceLevel: 'Junior', jobType: 'Full-time', description: 'Provide technical assistance and support to our employees.' },
  { id: 'job-17', title: 'Business Analyst', company: 'Data Systems', location: 'Chicago, IL', requiredSkills: ['Requirements Gathering', 'Data Analysis', 'SQL', 'Communication'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Bridge the gap between business needs and technical solutions.' },
  { id: 'job-18', title: 'UX Researcher', company: 'Creative Minds', location: 'San Francisco, CA', requiredSkills: ['User Research', 'Usability Testing', 'Data Analysis'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Conduct research to understand user behaviors, needs, and motivations.' },
  { id: 'job-19', title: 'Cloud Engineer', company: 'Cloud Innovations', location: 'Remote', requiredSkills: ['AWS', 'Azure', 'GCP', 'Terraform'], experienceLevel: 'Mid-Level', jobType: 'Full-time', description: 'Design, implement, and maintain our multi-cloud infrastructure.' },
  { id: 'job-20', title: 'Marketing Intern', company: 'MarketPro', location: 'Austin, TX', requiredSkills: ['Marketing', 'Communication', 'Social Media'], experienceLevel: 'Fresher', jobType: 'Internship', description: 'Assist the marketing team with various campaigns and tasks.' }
];

const RESOURCES = [
  { id: 'res-1', title: 'React - The Complete Guide (incl Hooks, React Router, Redux)', platform: 'Udemy', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', relatedSkills: ['React', 'JavaScript', 'HTML', 'CSS'], cost: 'Paid' },
  { id: 'res-2', title: 'FreeCodeCamp Responsive Web Design', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', relatedSkills: ['HTML', 'CSS'], cost: 'Free' },
  { id: 'res-3', title: 'The Complete Node.js Developer Course', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', relatedSkills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'], cost: 'Paid' },
  { id: 'res-4', title: 'Google Data Analytics Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', relatedSkills: ['SQL', 'Data Analysis', 'Data Visualization', 'Python'], cost: 'Paid' },
  { id: 'res-5', title: 'Figma UI UX Design Essentials', platform: 'Udemy', url: 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/', relatedSkills: ['Figma', 'UI/UX Design', 'Prototyping'], cost: 'Paid' },
  { id: 'res-6', title: 'JavaScript Algorithms and Data Structures', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', relatedSkills: ['JavaScript', 'Data Structures', 'Algorithms'], cost: 'Free' },
  { id: 'res-7', title: 'The Odin Project - Full Stack JavaScript', platform: 'The Odin Project', url: 'https://www.theodinproject.com/paths/full-stack-javascript', relatedSkills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React'], cost: 'Free' },
  { id: 'res-8', title: 'AWS Certified Cloud Practitioner', platform: 'Udemy', url: 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/', relatedSkills: ['AWS', 'Cloud Computing'], cost: 'Paid' },
  { id: 'res-9', title: 'CS50\'s Introduction to Computer Science', platform: 'edX', url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', relatedSkills: ['C', 'Python', 'SQL', 'Algorithms'], cost: 'Free' },
  { id: 'res-10', title: 'Learn Python 3 from Scratch', platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-python-3', relatedSkills: ['Python'], cost: 'Paid' },
  { id: 'res-11', title: 'Digital Marketing Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/digital-marketing', relatedSkills: ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing'], cost: 'Paid' },
  { id: 'res-12', title: 'Traversy Media - React Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=w7ejDZ8o_s8', relatedSkills: ['React', 'JavaScript'], cost: 'Free' },
  { id: 'res-13', title: 'Docker for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', relatedSkills: ['Docker', 'DevOps'], cost: 'Free' },
  { id: 'res-14', title: 'SQL for Data Science', platform: 'Coursera', url: 'https://www.coursera.org/learn/sql-for-data-science', relatedSkills: ['SQL', 'Data Analysis'], cost: 'Paid' },
  { id: 'res-15', title: 'The Complete Web Developer in 2024: Zero to Mastery', platform: 'Udemy', url: 'https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/', relatedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL'], cost: 'Paid' },
  { id: 'res-16', title: 'Agile Crash Course', platform: 'Udemy', url: 'https://www.udemy.com/course/agile-crash-course/', relatedSkills: ['Agile', 'Scrum', 'Product Management'], cost: 'Paid' },
  { id: 'res-17', title: 'Learn TypeScript - Full Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=30LWjhZzg50', relatedSkills: ['TypeScript', 'JavaScript'], cost: 'Free' },
  { id: 'res-18', title: 'Machine Learning by Andrew Ng', platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', relatedSkills: ['Machine Learning', 'Algorithms'], cost: 'Free' },
  { id: 'res-19', title: 'Graphic Design Basics', platform: 'Canva', url: 'https://www.canva.com/designschool/tutorials/getting-started/graphic-design-basics/', relatedSkills: ['Graphic Design', 'Branding'], cost: 'Free' },
  { id: 'res-20', title: 'Learn Communication Skills', platform: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning/topics/communication', relatedSkills: ['Communication', 'Public Speaking'], cost: 'Paid' }
];


// --- UTILITY FUNCTIONS ---
const formatUserForClient = (dbUser) => {
    if (!dbUser) return null;
    const { password_hash, ...user } = dbUser;
    return {
        ...user,
        skills: user.skills ? user.skills.split(',').map(s => s.trim()) : [],
    };
};

// --- AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- API ROUTES ---

// AUTH
app.post('/auth/register', async (req, res) => {
    const { email, password, fullName, education, experienceLevel, careerTrack } = req.body;
    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Email, password, and full name are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await pool.getConnection();
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            connection.release();
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        
        const [result] = await connection.query(
            'INSERT INTO users (fullName, email, password_hash, education, experienceLevel, careerTrack, skills, projects, careerInterests, cvNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [fullName, email, hashedPassword, education, experienceLevel, careerTrack, '', '', '', '']
        );
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        connection.release();

        const newUser = formatUserForClient(rows[0]);
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const userForClient = formatUserForClient(user);
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ user: userForClient, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});

app.get('/auth/me', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(formatUserForClient(rows[0]));
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// USERS
app.put('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    if (req.user.id.toString() !== userId) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
    }
    const { fullName, education, experienceLevel, careerTrack, skills, projects, careerInterests, cvNotes } = req.body;
    const skillsString = Array.isArray(skills) ? skills.join(', ') : '';
    
    try {
        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE users SET fullName = ?, education = ?, experienceLevel = ?, careerTrack = ?, skills = ?, projects = ?, careerInterests = ?, cvNotes = ? WHERE id = ?',
            [fullName, education, experienceLevel, careerTrack, skillsString, projects, careerInterests, cvNotes, userId]
        );
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        connection.release();

        res.json(formatUserForClient(rows[0]));
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// JOBS & RESOURCES
app.get('/jobs', (req, res) => res.json(JOBS));
app.get('/jobs/:id', (req, res) => {
    const job = JOBS.find(j => j.id === req.params.id);
    if (job) res.json(job);
    else res.status(404).json({ message: 'Job not found' });
});

app.get('/resources', (req, res) => res.json(RESOURCES));

// RECOMMENDATIONS
const getRecommendations = (user, allItems, skillField) => {
    const userSkills = new Set((user.skills || []).map(s => s.toLowerCase()));
    if (userSkills.size === 0) return [];

    const recommendations = [];
    allItems.forEach(item => {
        const matchingSkills = item[skillField].filter(skill => userSkills.has(skill.toLowerCase()));
        if (matchingSkills.length > 0) {
            recommendations.push({ item, reason: `Matches skills: ${matchingSkills.join(', ')}`, matchingSkills });
        }
    });
    recommendations.sort((a, b) => b.matchingSkills.length - a.matchingSkills.length);
    return recommendations;
};

app.get('/recommendations/jobs', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        connection.release();
        if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
        
        const user = formatUserForClient(rows[0]);
        const recommended = getRecommendations(user, JOBS, 'requiredSkills');
        res.json(recommended);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/recommendations/resources', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        connection.release();
        if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
        
        const user = formatUserForClient(rows[0]);
        
        // Logic based ONLY on career interests and career track.
        const userInterestKeywords = [
            ...(user.careerInterests || '').toLowerCase().split(/[\s,]+/),
            ...(user.careerTrack || '').toLowerCase().split(/[\s,]+/)
        ].filter(word => word.length > 2 && !['and', 'for', 'the', 'dev', 'data', 'web', 'engineer', 'developer', 'specialist'].includes(word));
        
        const userInterestsSet = new Set(userInterestKeywords.filter(Boolean));

        if (userInterestsSet.size === 0) {
            return res.json([]);
        }

        const recommendations = [];
        RESOURCES.forEach(resource => {
            const resourceText = (resource.title + ' ' + resource.relatedSkills.join(' ')).toLowerCase();
            
            const matchingInterests = [...userInterestsSet].filter(interest => resourceText.includes(interest));
            
            if (matchingInterests.length > 0) {
                const uniqueMatchingInterests = [...new Set(matchingInterests)];
                recommendations.push({ 
                    item: resource, 
                    reason: `Matches your interests: ${uniqueMatchingInterests.join(', ')}`, 
                    matchingSkills: uniqueMatchingInterests // field name must be matchingSkills for frontend
                });
            }
        });

        recommendations.sort((a, b) => b.matchingSkills.length - a.matchingSkills.length);
        res.json(recommendations);

    } catch (error) {
        console.error('Resource recommendation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
