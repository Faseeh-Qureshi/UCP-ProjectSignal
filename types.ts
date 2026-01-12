export enum UserRole {
  STUDENT = 'Student',
  FACULTY = 'Faculty',
  ADMIN = 'University Admin',
  PUBLIC = 'External Partner'
}

export enum ProjectStatus {
  SUBMITTED = 'Under Review',
  APPROVED = 'Verified Signal',
  REJECTED = 'Revision Needed',
  FEATURED = 'Hall of Fame'
}

export enum VisibilityLevel {
  PRIVATE = 'Private',
  FACULTY = 'Faculty-Only',
  DEPARTMENT = 'Department-Only',
  PUBLIC = 'Public Showcase'
}

export enum ProjectType {
  RESEARCH = 'Research & Analysis',
  APPLICATION = 'Technical Application',
  DESIGN = 'Design & Architecture',
  STRATEGY = 'Business Strategy',
  FINANCE = 'Financial Analysis',
  ROBOTICS = 'Robotics & Automation',
  BLOCKCHAIN = 'Blockchain & Web3',
  IOT = 'Internet of Things',
  MEDIA = 'Digital Media & Film',
  CYBERSECURITY = 'Cybersecurity'
}

export const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F', 'Pass', 'Fail'];

export interface Department {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  avatarUrl?: string;
  // Enhanced Profile Fields
  bio?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  expertise?: string[]; // For Faculty
  officeHours?: string; // For Faculty
  designation?: string; // e.g. "Associate Professor"
}

export interface ProjectMember {
  id: string;
  name: string;
  rollNumber: string;
  contribution: string;
  skills: string[];
  validated: boolean;
}

export interface Artifact {
  id: string;
  fileName: string;
  fileType: string;
  visibility: VisibilityLevel;
  url: string; 
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  outcomes: string;
  departmentId: string;
  type: ProjectType;
  year: number;
  term: 'Fall' | 'Spring' | 'Summer'; // New Field for Cohort Filtering
  status: ProjectStatus;
  members: ProjectMember[];
  artifacts: Artifact[];
  submittedBy: string;
  coverImage?: string;
  facultyComments?: string;
  tags: string[];
  endorsements: number;
  
  // Lifecycle & Grading
  grade?: string;
  gradeVisible: boolean;
  lastUpdated: string;

  // Industry & Integrity Fields
  supervisorId?: string; // Link to User ID
  supervisorName?: string; // Fallback
  repositoryUrl?: string; 
  repositoryVisibility: VisibilityLevel; 
  demoVideoUrl?: string; // New: For Pitch/Demo
  license?: string; 
  industryPartner?: string; 
  
  // Showcase Fields
  awards?: string[]; // e.g., ["Dean's List", "Best UX"]
  featuredCategory?: 'innovation' | 'sustainability' | 'impact';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'endorsement';
  read: boolean;
  timestamp: string;
}