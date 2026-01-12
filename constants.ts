import { Department, Project, ProjectStatus, ProjectType, User, UserRole, VisibilityLevel, Notification } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-cs', name: 'Computer Science', color: 'bg-indigo-50 text-indigo-800' },
  { id: 'dept-bus', name: 'Business School', color: 'bg-emerald-50 text-emerald-800' },
  { id: 'dept-arch', name: 'School of Architecture', color: 'bg-stone-50 text-stone-800' },
  { id: 'dept-psych', name: 'Psychology', color: 'bg-rose-50 text-rose-800' },
  { id: 'dept-eng', name: 'Mechanical Engineering', color: 'bg-orange-50 text-orange-800' },
  { id: 'dept-media', name: 'Media & Communication', color: 'bg-purple-50 text-purple-800' },
];

export const MOCK_USERS: User[] = [
  // --- STUDENTS ---
  { 
    id: 'u-std-1', 
    name: 'Bilal Ahmed', 
    email: 'bilal.ahmed@ucp.edu.pk', 
    role: UserRole.STUDENT, 
    departmentId: 'dept-cs',
    bio: 'Full Stack Developer passionate about EdTech and AI. Building scalable systems for social impact.',
    linkedInUrl: 'linkedin.com/in/bilalahmed',
    expertise: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    designation: 'BSCS Final Year',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'u-std-2', 
    name: 'Zara Malik', 
    email: 'zara.malik@ucp.edu.pk', 
    role: UserRole.STUDENT, 
    departmentId: 'dept-arch', 
    bio: 'Focusing on sustainable urban regeneration and bamboo composite structures.',
    designation: 'B.Arch Final Year',
    expertise: ['Revit', 'AutoCAD', 'Sustainable Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'u-std-3', 
    name: 'Usman Khan', 
    email: 'usman.k@ucp.edu.pk', 
    role: UserRole.STUDENT, 
    departmentId: 'dept-bus', 
    bio: 'Finance major analyzing crypto-currency volatility in emerging markets.',
    designation: 'BBA Finance',
    expertise: ['Financial Modeling', 'Risk Analysis'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
      id: 'u-std-4',
      name: 'Hina Riaz',
      email: 'hina.r@ucp.edu.pk',
      role: UserRole.STUDENT,
      departmentId: 'dept-media',
      bio: 'Documentary filmmaker focusing on social realism in Lahore.',
      designation: 'BS Media Final Year',
      expertise: ['Video Editing', 'Scriptwriting', 'Cinematography'],
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  
  // --- FACULTY (Supervisors) ---
  { 
    id: 'u-fac-cs', 
    name: 'Dr. Arshad Hussain', 
    email: 'arshad.hussain@ucp.edu.pk', 
    role: UserRole.FACULTY, 
    departmentId: 'dept-cs',
    bio: 'Head of AI Research Lab. PhD in Computer Vision from LUMS. 15+ years of academic and industry experience.',
    expertise: ['Deep Learning', 'Computer Vision', 'Pattern Recognition'],
    officeHours: 'Mon-Wed 11:00 AM - 1:00 PM',
    designation: 'Associate Professor & HOD',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'u-fac-bus', 
    name: 'Ms. Ayesha Siddique', 
    email: 'ayesha.s@ucp.edu.pk', 
    role: UserRole.FACULTY, 
    departmentId: 'dept-bus',
    bio: 'Specialist in Macroeconomics and Supply Chain Management. Former Consultant at McKinsey.',
    expertise: ['Supply Chain', 'Macroeconomics', 'Strategic Management'],
    officeHours: 'Tue-Thu 2:00 PM - 4:00 PM',
    designation: 'Senior Lecturer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'u-fac-arch', 
    name: 'Arc. Taimoor Khan', 
    email: 'taimoor.k@ucp.edu.pk', 
    role: UserRole.FACULTY, 
    departmentId: 'dept-arch',
    bio: 'Award-winning architect focusing on indigenous materials and low-cost housing solutions.',
    expertise: ['Urban Planning', 'Green Architecture', 'Heritage Conservation'],
    officeHours: 'Wed 10:00 AM - 12:00 PM',
    designation: 'Assistant Professor'
  },
  
  // --- ADMIN & PUBLIC ---
  { id: 'u-adm-1', name: 'Registrar Office', email: 'registrar@ucp.edu.pk', role: UserRole.ADMIN, designation: 'University Administration' },
  { id: 'u-pub-1', name: 'Systems Ltd Recruitment', email: 'careers@systemsltd.com', role: UserRole.PUBLIC, designation: 'Industry Partner', bio: 'Looking for top CS talent.' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'TrafficSense: AI-Driven Signal Optimization',
    abstract: 'An intelligent traffic management system utilizing YOLOv8 for real-time vehicle density detection to dynamically adjust signal timings, reducing congestion in Lahore by an estimated 35%. Validated against Punjab Safe Cities dataset.',
    outcomes: 'Deployed functional prototype on Jetson Nano. Achieved 92% detection accuracy in fog conditions.',
    departmentId: 'dept-cs',
    type: ProjectType.APPLICATION,
    year: 2024,
    term: 'Spring',
    status: ProjectStatus.FEATURED, // Featured for CS
    submittedBy: 'u-std-1',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', // Space/Tech vibe
    tags: ['Artificial Intelligence', 'Smart Cities', 'Computer Vision', 'Python'],
    endorsements: 85,
    members: [
      { id: 'm-1', name: 'Bilal Ahmed', rollNumber: 'L1F19BSCS0045', contribution: 'AI Model Training & Backend', skills: ['Python', 'PyTorch', 'FastAPI'], validated: true },
      { id: 'm-2', name: 'Saad Ali', rollNumber: 'L1F19BSCS0112', contribution: 'Hardware Integration & IoT', skills: ['Raspberry Pi', 'C++', 'Networking'], validated: true }
    ],
    artifacts: [
      { id: 'art-1', fileName: 'Research_Paper_IEEE.pdf', fileType: 'pdf', visibility: VisibilityLevel.PUBLIC, url: '#' },
      { id: 'art-2', fileName: 'Source_Code.zip', fileType: 'zip', visibility: VisibilityLevel.DEPARTMENT, url: '#' }
    ],
    gradeVisible: true,
    lastUpdated: '2024-05-15T10:00:00Z',
    grade: 'A',
    supervisorId: 'u-fac-cs',
    supervisorName: 'Dr. Arshad Hussain',
    repositoryUrl: 'https://github.com/bilal-ucp/traffic-sense',
    repositoryVisibility: VisibilityLevel.PUBLIC,
    demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
    license: 'MIT License',
    industryPartner: 'Punjab Safe Cities Authority',
    awards: ['Best Final Year Project 2024', 'Innovation Award'],
    featuredCategory: 'innovation'
  },
  {
    id: 'proj-2',
    title: 'Eco-Haven: Bamboo Composite Housing',
    abstract: 'A modular architectural framework for affordable housing in flood-prone areas of Southern Punjab. Utilizes treated bamboo and mud-concrete composites for thermal comfort and flood resilience.',
    outcomes: 'Complete Revit BIM models, structural load analysis report, and 1:20 scale physical model tested for hydraulic pressure.',
    departmentId: 'dept-arch',
    type: ProjectType.DESIGN,
    year: 2024,
    term: 'Spring',
    status: ProjectStatus.FEATURED, // Featured for Arch
    submittedBy: 'u-std-2',
    coverImage: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?q=80&w=2072&auto=format&fit=crop', // Architecture/Structure
    tags: ['Sustainable Design', 'Disaster Relief', 'Urban Planning', 'BIM'],
    endorsements: 124,
    members: [
      { id: 'm-3', name: 'Zara Malik', rollNumber: 'L1F19BARC0022', contribution: 'Architectural Design & BIM', skills: ['Revit', 'Lumion', 'Sustainable Architecture'], validated: true }
    ],
    artifacts: [
      { id: 'art-3', fileName: 'Architectural_Drawings.pdf', fileType: 'pdf', visibility: VisibilityLevel.PUBLIC, url: '#' },
      { id: 'art-4', fileName: 'Structural_Analysis.xlsx', fileType: 'xls', visibility: VisibilityLevel.DEPARTMENT, url: '#' },
      { id: 'art-5', fileName: '3D_Walkthrough.mp4', fileType: 'video', visibility: VisibilityLevel.PUBLIC, url: '#' }
    ],
    gradeVisible: true,
    lastUpdated: '2024-05-20T14:30:00Z',
    grade: 'A+',
    supervisorId: 'u-fac-arch',
    supervisorName: 'Arc. Taimoor Khan',
    repositoryVisibility: VisibilityLevel.PRIVATE,
    demoVideoUrl: '',
    license: 'Creative Commons BY-NC-ND',
    awards: ['Sustainability Gold Medal', 'Dean\'s Honor Roll'],
    featuredCategory: 'sustainability'
  },
  {
    id: 'proj-3',
    title: 'FinTech Adoption in SMEs',
    abstract: 'A quantitative analysis of barriers to adoption of digital payment gateways among 500+ SMEs in Lahore markets. Identifies tax fear and technical literacy as primary blockers.',
    outcomes: 'Policy recommendation whitepaper submitted to Chamber of Commerce. 500+ survey dataset cleaned and visualized.',
    departmentId: 'dept-bus',
    type: ProjectType.STRATEGY,
    year: 2023,
    term: 'Fall',
    status: ProjectStatus.APPROVED,
    submittedBy: 'u-std-3',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop', // Business/Finance
    tags: ['FinTech', 'SME Sector', 'Economic Policy', 'Data Analysis'],
    endorsements: 45,
    members: [
      { id: 'm-4', name: 'Usman Khan', rollNumber: 'L1F20BBA0199', contribution: 'Data Collection & SPSS Analysis', skills: ['SPSS', 'Market Research', 'Financial Analysis'], validated: true }
    ],
    artifacts: [
      { id: 'art-6', fileName: 'Research_Thesis_Final.pdf', fileType: 'pdf', visibility: VisibilityLevel.FACULTY, url: '#' },
      { id: 'art-7', fileName: 'Survey_Data_Raw.csv', fileType: 'csv', visibility: VisibilityLevel.PRIVATE, url: '#' }
    ],
    gradeVisible: true,
    lastUpdated: '2024-06-01T09:00:00Z',
    grade: 'A-',
    supervisorId: 'u-fac-bus',
    supervisorName: 'Ms. Ayesha Siddique',
    repositoryVisibility: VisibilityLevel.PRIVATE,
    industryPartner: 'Lahore Chamber of Commerce',
    featuredCategory: 'impact'
  },
  {
      id: 'proj-4',
      title: 'NeuroSky: Brain-Computer Interface for ALS Patients',
      abstract: 'A non-invasive BCI headset interface allowing patients with Amyotrophic Lateral Sclerosis (ALS) to control basic home automation appliances using EEG signals.',
      outcomes: 'Working prototype with 85% command recognition rate.',
      departmentId: 'dept-cs',
      type: ProjectType.RESEARCH,
      year: 2023,
      term: 'Fall',
      status: ProjectStatus.APPROVED,
      submittedBy: 'u-std-1',
      coverImage: 'https://images.unsplash.com/photo-1531297461136-82lw8l9k1i?q=80&w=2072&auto=format&fit=crop', // Technology/Circuit
      tags: ['BCI', 'Neuroscience', 'Python', 'Healthcare'],
      endorsements: 60,
      members: [
          { id: 'm-5', name: 'Ali Raza', rollNumber: 'L1F19BSCS0099', contribution: 'Signal Processing', skills: ['Matlab', 'Python', 'Signal Processing'], validated: true }
      ],
      artifacts: [],
      gradeVisible: true,
      lastUpdated: '2024-06-10T11:00:00Z',
      supervisorId: 'u-fac-cs',
      supervisorName: 'Dr. Arshad Hussain',
      repositoryVisibility: VisibilityLevel.PRIVATE
  },
  {
      id: 'proj-5',
      title: 'AgriBot: Autonomous Harvesting Unit',
      abstract: 'A robotic rover designed for autonomous citrus harvesting in Punjab orchards. Uses computer vision to identify ripe fruit and a soft-grip robotic arm for damage-free picking.',
      outcomes: 'Prototype V2 developed with 4-hour battery life. Reduced labor costs by estimated 40% in field trials.',
      departmentId: 'dept-eng',
      type: ProjectType.ROBOTICS,
      year: 2024,
      term: 'Spring',
      status: ProjectStatus.SUBMITTED,
      submittedBy: 'u-std-1', // Using std-1 for demo purposes
      coverImage: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop', // Robotics/AI
      tags: ['Robotics', 'Agriculture', 'Automation', 'ROS'],
      endorsements: 32,
      members: [
          { id: 'm-6', name: 'Omar Farooq', rollNumber: 'L1F19BME0111', contribution: 'Mechanical Design', skills: ['SolidWorks', 'Mechatronics'], validated: false }
      ],
      artifacts: [],
      gradeVisible: false,
      lastUpdated: '2024-06-25T08:30:00Z',
      supervisorName: 'Dr. Taha Ali',
      repositoryVisibility: VisibilityLevel.PRIVATE
  },
  {
      id: 'proj-6',
      title: 'The Silent Lens: Documentary',
      abstract: 'A short documentary exploring the disappearing craft of analog photography in the walled city of Lahore. Features interviews with the last three camera repairmen in the city.',
      outcomes: 'Selected for screening at Lahore Digital Arts Festival.',
      departmentId: 'dept-media',
      type: ProjectType.MEDIA,
      year: 2024,
      term: 'Summer',
      status: ProjectStatus.APPROVED,
      submittedBy: 'u-std-4',
      coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop', // Camera/Film
      tags: ['Documentary', 'Heritage', 'Cinematography'],
      endorsements: 95,
      members: [
          { id: 'm-7', name: 'Hina Riaz', rollNumber: 'L1F20BSM0022', contribution: 'Direction & Editing', skills: ['Premiere Pro', 'Storytelling'], validated: true }
      ],
      artifacts: [{ id: 'art-8', fileName: 'Official_Trailer.mp4', fileType: 'video', visibility: VisibilityLevel.PUBLIC, url: '#' }],
      gradeVisible: true,
      lastUpdated: '2024-05-30T14:00:00Z',
      supervisorName: 'Sir Adeel Hashmi',
      repositoryVisibility: VisibilityLevel.PUBLIC
  },
  {
      id: 'proj-7',
      title: 'BlockVote: Secure Campus Elections',
      abstract: 'A decentralized voting application built on Ethereum to ensure transparency and immutability in university student council elections.',
      outcomes: 'Smart contracts audited with 100% test coverage. Successfully handled mock election with 1000+ votes.',
      departmentId: 'dept-cs',
      type: ProjectType.BLOCKCHAIN,
      year: 2024,
      term: 'Spring',
      status: ProjectStatus.SUBMITTED,
      submittedBy: 'u-std-1',
      coverImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop', // Blockchain
      tags: ['Blockchain', 'Solidity', 'Web3', 'Security'],
      endorsements: 18,
      members: [
          { id: 'm-8', name: 'Bilal Ahmed', rollNumber: 'L1F19BSCS0045', contribution: 'Smart Contract Dev', skills: ['Solidity', 'React'], validated: false }
      ],
      artifacts: [],
      gradeVisible: true,
      lastUpdated: '2024-06-28T12:00:00Z',
      supervisorName: 'Dr. Arshad Hussain',
      repositoryVisibility: VisibilityLevel.PUBLIC
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n-1', userId: 'u-std-1', title: 'Project Approved', message: 'Dr. Arshad Hussain has approved your project "TrafficSense".', type: 'success', read: false, timestamp: '2024-06-01T10:30:00Z' },
    { id: 'n-2', userId: 'u-std-1', title: 'New Endorsement', message: 'Systems Ltd Recruitment endorsed your project.', type: 'endorsement', read: false, timestamp: '2024-06-02T14:15:00Z' },
    { id: 'n-3', userId: 'u-std-1', title: 'Artifact Deadline', message: 'Final deliverables for CS Dept are due by June 20th.', type: 'alert', read: true, timestamp: '2024-05-28T09:00:00Z' }
];