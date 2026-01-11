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
  INTERDISCIPLINARY = 'Interdisciplinary'
}

export interface Department {
  id: string;
  name: string;
  color: string; // For UI differentiation
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string; // Optional for Public/Admin
  avatarUrl?: string;
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
  fileType: string; // 'pdf', 'mp4', 'zip', 'obj', 'fig'
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
  status: ProjectStatus;
  members: ProjectMember[];
  artifacts: Artifact[];
  submittedBy: string;
  coverImage?: string; // Critical for "Art of Science"
  facultyComments?: string;
}