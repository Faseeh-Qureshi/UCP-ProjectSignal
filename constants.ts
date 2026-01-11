import { Department, Project, ProjectStatus, ProjectType, User, UserRole, VisibilityLevel } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-cs', name: 'Computer Science', color: 'bg-blue-100 text-blue-800' },
  { id: 'dept-bus', name: 'Business School', color: 'bg-amber-100 text-amber-800' },
  { id: 'dept-arch', name: 'School of Architecture', color: 'bg-stone-100 text-stone-800' },
  { id: 'dept-psych', name: 'Psychology', color: 'bg-rose-100 text-rose-800' },
  { id: 'dept-eng', name: 'Mechanical Engineering', color: 'bg-orange-100 text-orange-800' },
];

export const MOCK_USERS: User[] = [
  // Students
  { id: 'u-std-1', name: 'Alice Chen', email: 'alice@stanford.edu', role: UserRole.STUDENT, departmentId: 'dept-cs' },
  { id: 'u-std-3', name: 'Charlie Davis', email: 'charlie@stanford.edu', role: UserRole.STUDENT, departmentId: 'dept-arch' },
  
  // Faculty
  { id: 'u-fac-cs', name: 'Dr. Robert Smith', email: 'rsmith@stanford.edu', role: UserRole.FACULTY, departmentId: 'dept-cs' },
  { id: 'u-fac-arch', name: 'Prof. Elena Vane', email: 'evane@stanford.edu', role: UserRole.FACULTY, departmentId: 'dept-arch' },
  
  // Admin & Public
  { id: 'u-adm-1', name: 'Sarah Admin', email: 'admin@stanford.edu', role: UserRole.ADMIN },
  { id: 'u-pub-1', name: 'TechRecruit Inc.', email: 'recruiter@tech.com', role: UserRole.PUBLIC },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Neural Networks in Traffic Flow',
    abstract: 'Optimizing high-density urban traffic light intervals using real-time computer vision analysis.',
    outcomes: 'Deployed functional prototype on Raspberry Pi cluster. 15% reduction in wait times.',
    departmentId: 'dept-cs',
    type: ProjectType.APPLICATION,
    year: 2024,
    status: ProjectStatus.APPROVED,
    submittedBy: 'u-std-1',
    coverImage: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop',
    members: [
      { id: 'm-1', name: 'Alice Chen', rollNumber: 'CS-24-001', contribution: 'Algorithm Design & CV Model', skills: ['Python', 'TensorFlow', 'System Architecture'], validated: true },
      { id: 'm-2', name: 'Bob Jones', rollNumber: 'CS-24-002', contribution: 'Hardware Integration', skills: ['IoT', 'Embedded C', 'React'], validated: true }
    ],
    artifacts: [
      { id: 'art-1', fileName: 'IEEE_Paper_Draft.pdf', fileType: 'pdf', visibility: VisibilityLevel.PUBLIC, url: '#' },
      { id: 'art-2', fileName: 'Source_Code.zip', fileType: 'code', visibility: VisibilityLevel.FACULTY, url: '#' }
    ]
  },
  {
    id: 'proj-2',
    title: 'The Vertical Village: Sustainable Housing',
    abstract: 'A modular architectural approach to low-cost, carbon-neutral housing in high-density equatorial zones.',
    outcomes: 'Full 3D Revit models, energy efficiency analysis, and scale model photography.',
    departmentId: 'dept-arch',
    type: ProjectType.DESIGN,
    year: 2024,
    status: ProjectStatus.APPROVED,
    submittedBy: 'u-std-3',
    coverImage: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2080&auto=format&fit=crop',
    members: [
      { id: 'm-3', name: 'Charlie Davis', rollNumber: 'AR-24-055', contribution: 'Structural Concept & Rendering', skills: ['Revit', 'Sustainable Design', '3D Modeling'], validated: true }
    ],
    artifacts: [
      { id: 'art-4', fileName: 'Final_Render_Set.pdf', fileType: 'pdf', visibility: VisibilityLevel.PUBLIC, url: '#' },
      { id: 'art-5', fileName: 'Structure_Analysis.xls', fileType: 'xls', visibility: VisibilityLevel.DEPARTMENT, url: '#' }
    ]
  },
  {
    id: 'proj-3',
    title: 'Cognitive Shifts in Digital Spaces',
    abstract: 'A quantitative and qualitative analysis of attention span retention in VR vs. AR learning environments.',
    outcomes: 'Statistical analysis of 500+ participants.',
    departmentId: 'dept-psych',
    type: ProjectType.RESEARCH,
    year: 2024,
    status: ProjectStatus.SUBMITTED,
    submittedBy: 'u-std-4',
    coverImage: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=2000&auto=format&fit=crop',
    members: [
      { id: 'm-4', name: 'Diana Prince', rollNumber: 'PS-24-012', contribution: 'Experimental Design', skills: ['Data Analysis', 'SPSS', 'Cognitive Science'], validated: false }
    ],
    artifacts: [
      { id: 'art-6', fileName: 'Thesis_Final.pdf', fileType: 'pdf', visibility: VisibilityLevel.FACULTY, url: '#' },
    ]
  }
];