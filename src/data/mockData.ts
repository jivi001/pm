import { User, Internship, Application, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Kumar',
    email: 'arjun@example.com',
    aadhaar: '1234-5678-9012',
    role: 'candidate',
    skills: ['React', 'Node.js', 'Python', 'SQL'],
    location: 'Delhi',
    phone: '+91-9876543210',
    password: 'demo123'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    aadhaar: '2345-6789-0123',
    role: 'candidate',
    skills: ['Java', 'Spring Boot', 'AWS', 'MySQL'],
    location: 'Mumbai',
    phone: '+91-9876543211',
    password: 'candidate123'
  },
  {
    id: '3',
    name: 'Rajesh Patel', // HR Manager name
    email: 'hr@techcorp.com',
    companyRegistration: 'U12345AB1234PTC123456',
    companyName: 'TechCorp Solutions Pvt Ltd',
    role: 'admin',
    skills: ['Technology', 'Software Development', 'AI/ML'],
    location: 'Bangalore',
    phone: '+91-9876543212',
    password: 'admin123'
  },
  {
    id: '4',
    name: 'Sunita Reddy',
    email: 'hiring@datainsights.com',
    companyRegistration: 'U67890KA2020PTC098765',
    companyName: 'DataInsights Pvt Ltd',
    role: 'admin',
    skills: ['Analytics', 'Data Science', 'Business Intelligence'],
    location: 'Hyderabad',
    phone: '+91-9876543213',
    password: 'company123'
  }
];

export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Software Development Intern',
    company: 'TechCorp Solutions',
    sector: 'Technology',
    location: 'Bangalore',
    duration: '3 months',
    stipend: 15000,
    skillsRequired: ['React', 'Node.js', 'JavaScript'],
    description: 'Join our dynamic team to work on cutting-edge web applications. You will be involved in developing user interfaces, APIs, and database management.',
    status: 'open',
    postedDate: '2024-01-15',
    deadline: '2024-02-15'
  },
  {
    id: '2',
    title: 'Data Analytics Intern',
    company: 'DataInsights Pvt Ltd',
    sector: 'Analytics',
    location: 'Delhi',
    duration: '4 months',
    stipend: 12000,
    skillsRequired: ['Python', 'SQL', 'Tableau', 'Statistics'],
    description: 'Work with large datasets to extract meaningful insights. Experience with data visualization and statistical analysis tools required.',
    status: 'open',
    postedDate: '2024-01-10',
    deadline: '2024-02-10'
  },
  {
    id: '3',
    title: 'Digital Marketing Intern',
    company: 'Creative Agency',
    sector: 'Marketing',
    location: 'Mumbai',
    duration: '2 months',
    stipend: 8000,
    skillsRequired: ['Social Media', 'Content Writing', 'SEO', 'Google Analytics'],
    description: 'Help create and execute digital marketing campaigns across various platforms. Learn about content strategy and performance analytics.',
    status: 'open',
    postedDate: '2024-01-12',
    deadline: '2024-02-12'
  },
  {
    id: '4',
    title: 'Financial Analysis Intern',
    company: 'FinanceHub',
    sector: 'Finance',
    location: 'Chennai',
    duration: '3 months',
    stipend: 10000,
    skillsRequired: ['Excel', 'Financial Modeling', 'Analysis', 'PowerBI'],
    description: 'Support financial planning and analysis activities. Work on budget forecasting and financial reporting.',
    status: 'open',
    postedDate: '2024-01-08',
    deadline: '2024-02-08'
  },
  {
    id: '5',
    title: 'Product Management Intern',
    company: 'StartupXYZ',
    sector: 'Product',
    location: 'Hyderabad',
    duration: '4 months',
    stipend: 18000,
    skillsRequired: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
    description: 'Learn product management fundamentals by working on real products. Conduct user research and analyze product metrics.',
    status: 'open',
    postedDate: '2024-01-14',
    deadline: '2024-02-14'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    internshipId: '1',
    candidateId: '1',
    status: 'pending',
    appliedDate: '2024-01-20',
    internship: mockInternships[0]
  },
  {
    id: '2',
    internshipId: '2',
    candidateId: '1',
    status: 'approved',
    appliedDate: '2024-01-18',
    internship: mockInternships[1]
  },
  {
    id: '3',
    internshipId: '3',
    candidateId: '2',
    status: 'rejected',
    appliedDate: '2024-01-16',
    internship: mockInternships[2]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'Your application for Software Development Intern has been received',
    type: 'application',
    isRead: false,
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    message: 'Congratulations! You have been selected for Data Analytics Intern',
    type: 'status',
    isRead: false,
    createdAt: '2024-01-22T15:20:00Z'
  },
  {
    id: '3',
    userId: '1',
    message: 'Reminder: Application deadline for Product Management Intern is tomorrow',
    type: 'reminder',
    isRead: true,
    createdAt: '2024-01-13T09:00:00Z'
  }
];

export const sectors = [
  'Technology',
  'Analytics',
  'Marketing',
  'Finance',
  'Product',
  'Operations',
  'Sales',
  'HR',
  'Design',
  'Consulting'
];

export const locations = [
  'Bangalore',
  'Delhi',
  'Mumbai',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Kochi'
];

export const skills = [
  'React',
  'Node.js',
  'Python',
  'Java',
  'JavaScript',
  'SQL',
  'AWS',
  'Docker',
  'Machine Learning',
  'Data Analysis',
  'Excel',
  'PowerBI',
  'Tableau',
  'SEO',
  'Content Writing',
  'Social Media',
  'Product Strategy',
  'User Research',
  'Agile',
  'Financial Modeling'
];