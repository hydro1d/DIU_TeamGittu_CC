
import { Job, ExperienceLevel, JobType } from '../types';

export const JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.FullTime,
    description: 'Join our team to build amazing user interfaces with React and TypeScript.'
  },
  {
    id: 'job-2',
    title: 'Backend Developer',
    company: 'Data Systems',
    location: 'New York, NY',
    requiredSkills: ['Node.js', 'Express', 'MySQL', 'REST APIs'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Design and implement scalable backend services and APIs.'
  },
  {
    id: 'job-3',
    title: 'UI/UX Designer',
    company: 'Creative Minds',
    location: 'San Francisco, CA',
    requiredSkills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.PartTime,
    description: 'Create intuitive and visually appealing designs for our mobile and web applications.'
  },
  {
    id: 'job-4',
    title: 'Data Analyst Intern',
    company: 'Innovatech',
    location: 'Remote',
    requiredSkills: ['SQL', 'Python', 'Pandas', 'Data Visualization'],
    experienceLevel: ExperienceLevel.Fresher,
    jobType: JobType.Internship,
    description: 'Analyze data to find insights and support business decisions.'
  },
  {
    id: 'job-5',
    title: 'Digital Marketing Specialist',
    company: 'MarketPro',
    location: 'Austin, TX',
    requiredSkills: ['SEO', 'SEM', 'Google Analytics', 'Content Marketing'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Develop and execute digital marketing campaigns to drive growth.'
  },
  {
    id: 'job-6',
    title: 'Full-Stack Developer',
    company: 'Cloud Innovations',
    location: 'Remote',
    requiredSkills: ['React', 'Node.js', 'AWS', 'MongoDB'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Work on both frontend and backend parts of our cloud-based platform.'
  },
  {
    id: 'job-7',
    title: 'Product Manager',
    company: 'Visionary Apps',
    location: 'Seattle, WA',
    requiredSkills: ['Agile', 'Product Roadmapping', 'Market Analysis', 'Communication'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Define product vision, strategy, and roadmap for our flagship application.'
  },
  {
    id: 'job-8',
    title: 'DevOps Engineer',
    company: 'InfraWorks',
    location: 'Remote',
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Automate and manage our cloud infrastructure and deployment pipelines.'
  },
  {
    id: 'job-9',
    title: 'Graphic Design Freelancer',
    company: 'Creative Minds',
    location: 'Remote',
    requiredSkills: ['Adobe Illustrator', 'Adobe Photoshop', 'Branding'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.Freelance,
    description: 'Create compelling graphics for marketing materials and social media.'
  },
  {
    id: 'job-10',
    title: 'Data Scientist',
    company: 'Data Systems',
    location: 'New York, NY',
    requiredSkills: ['Machine Learning', 'Python', 'TensorFlow', 'Scikit-learn'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Build machine learning models to solve complex business problems.'
  },
  {
    id: 'job-11',
    title: 'React Native Developer',
    company: 'Mobile First',
    location: 'Remote',
    requiredSkills: ['React Native', 'JavaScript', 'iOS', 'Android'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.FullTime,
    description: 'Develop cross-platform mobile applications using React Native.'
  },
  {
    id: 'job-12',
    title: 'Content Writer',
    company: 'MarketPro',
    location: 'Remote',
    requiredSkills: ['Content Marketing', 'Copywriting', 'SEO', 'Communication'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.PartTime,
    description: 'Write engaging and SEO-friendly content for our blog and website.'
  },
  {
    id: 'job-13',
    title: 'QA Tester Intern',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    requiredSkills: ['Manual Testing', 'Bug Tracking', 'Attention to Detail'],
    experienceLevel: ExperienceLevel.Fresher,
    jobType: JobType.Internship,
    description: 'Help ensure the quality of our software through manual testing and bug reporting.'
  },
  {
    id: 'job-14',
    title: 'Junior Python Developer',
    company: 'Innovatech',
    location: 'Austin, TX',
    requiredSkills: ['Python', 'Django', 'Flask', 'SQL'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.FullTime,
    description: 'Develop web applications and scripts using Python frameworks.'
  },
  {
    id: 'job-15',
    title: 'Social Media Manager',
    company: 'MarketPro',
    location: 'Remote',
    requiredSkills: ['Social Media Strategy', 'Content Creation', 'Community Management'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.FullTime,
    description: 'Manage and grow our social media presence across various platforms.'
  },
  {
    id: 'job-16',
    title: 'IT Support Specialist',
    company: 'Tech Solutions Inc.',
    location: 'New York, NY',
    requiredSkills: ['Troubleshooting', 'Customer Service', 'Networking'],
    experienceLevel: ExperienceLevel.Junior,
    jobType: JobType.FullTime,
    description: 'Provide technical assistance and support to our employees.'
  },
  {
    id: 'job-17',
    title: 'Business Analyst',
    company: 'Data Systems',
    location: 'Chicago, IL',
    requiredSkills: ['Requirements Gathering', 'Data Analysis', 'SQL', 'Communication'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Bridge the gap between business needs and technical solutions.'
  },
  {
    id: 'job-18',
    title: 'UX Researcher',
    company: 'Creative Minds',
    location: 'San Francisco, CA',
    requiredSkills: ['User Research', 'Usability Testing', 'Data Analysis'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Conduct research to understand user behaviors, needs, and motivations.'
  },
  {
    id: 'job-19',
    title: 'Cloud Engineer',
    company: 'Cloud Innovations',
    location: 'Remote',
    requiredSkills: ['AWS', 'Azure', 'GCP', 'Terraform'],
    experienceLevel: ExperienceLevel.Mid,
    jobType: JobType.FullTime,
    description: 'Design, implement, and maintain our multi-cloud infrastructure.'
  },
  {
    id: 'job-20',
    title: 'Marketing Intern',
    company: 'MarketPro',
    location: 'Austin, TX',
    requiredSkills: ['Marketing', 'Communication', 'Social Media'],
    experienceLevel: ExperienceLevel.Fresher,
    jobType: JobType.Internship,
    description: 'Assist the marketing team with various campaigns and tasks.'
  }
];
