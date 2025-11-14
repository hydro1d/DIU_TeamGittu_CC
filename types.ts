
export enum ExperienceLevel {
  Fresher = 'Fresher',
  Junior = 'Junior',
  Mid = 'Mid-Level',
}

export enum JobType {
  Internship = 'Internship',
  PartTime = 'Part-time',
  FullTime = 'Full-time',
  Freelance = 'Freelance',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  education: string;
  experienceLevel: ExperienceLevel;
  careerTrack: string;
  skills: string[];
  projects: string;
  careerInterests: string;
  cvNotes: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  platform: string;
  url: string;
  relatedSkills: string[];
  cost: 'Free' | 'Paid';
}

export interface Match<T> {
  item: T;
  reason: string;
  matchingSkills: string[];
  matchingScore?: number;
}
