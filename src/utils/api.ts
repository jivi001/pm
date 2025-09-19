import { User, Internship, Application, Notification } from '../types';
import { mockUsers, mockInternships, mockApplications, mockNotifications } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Temporary storage for OTP verification (in real app, this would be server-side)
const otpStorage = new Map<string, { otp: string, userData: any, expires: number }>();

// Auth API
export const authAPI = {
  initiateLogin: async (loginRequest: {
    identifier: string;
    password: string;
    loginType: 'candidate' | 'admin';
  }): Promise<{ success: boolean; message?: string }> => {
    await delay(1000);
    
    let user: User | null = null;
    
    if (loginRequest.loginType === 'candidate') {
      user = mockUsers.find(u => u.aadhaar === loginRequest.identifier) || null;
    } else {
      user = mockUsers.find(u => u.companyRegistration === loginRequest.identifier) || null;
    }
    
    if (!user || user.password !== loginRequest.password) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    // Generate and store OTP (in real app, send via SMS)
    const otp = '123456'; // Demo OTP - in real app, generate random 6-digit number
    const key = `${loginRequest.identifier}_${loginRequest.loginType}`;
    otpStorage.set(key, {
      otp,
      userData: user,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    
    return { success: true };
  },

  verifyLogin: async (loginRequest: {
    identifier: string;
    password: string;
    loginType: 'candidate' | 'admin';
    otp: string;
  }): Promise<User | null> => {
    await delay(800);
    
    const key = `${loginRequest.identifier}_${loginRequest.loginType}`;
    const storedData = otpStorage.get(key);
    
    if (!storedData || storedData.expires < Date.now()) {
      return null; // OTP expired
    }
    
    if (storedData.otp !== loginRequest.otp) {
      return null; // Invalid OTP
    }
    
    // OTP verified, clean up and return user
    otpStorage.delete(key);
    return storedData.userData;
  },

  register: async (userData: Omit<User, 'id'>): Promise<User> => {
    await delay(1500);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => 
      (userData.aadhaar && u.aadhaar === userData.aadhaar) ||
      (userData.companyRegistration && u.companyRegistration === userData.companyRegistration) ||
      u.email === userData.email
    );
    
    if (existingUser) {
      throw new Error('User already exists with this Aadhaar/Company Registration or email');
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    mockUsers.push(newUser);
    return newUser;
  }
};

// Internships API
export const internshipsAPI = {
  getAll: async (filters?: {
    sector?: string;
    location?: string;
    skills?: string[];
  }): Promise<Internship[]> => {
    await delay(800);
    let filtered = [...mockInternships];

    if (filters?.sector) {
      filtered = filtered.filter(internship => 
        internship.sector.toLowerCase() === filters.sector?.toLowerCase()
      );
    }

    if (filters?.location) {
      filtered = filtered.filter(internship => 
        internship.location.toLowerCase() === filters.location?.toLowerCase()
      );
    }

    if (filters?.skills && filters.skills.length > 0) {
      filtered = filtered.filter(internship => 
        filters.skills?.some(skill => 
          internship.skillsRequired.some(reqSkill => 
            reqSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    return filtered;
  },

  getById: async (id: string): Promise<Internship | null> => {
    await delay(500);
    return mockInternships.find(internship => internship.id === id) || null;
  },

  create: async (internshipData: Omit<Internship, 'id' | 'postedDate'>): Promise<Internship> => {
    await delay(1200);
    const newInternship: Internship = {
      ...internshipData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0]
    };
    mockInternships.push(newInternship);
    return newInternship;
  },

  update: async (id: string, updates: Partial<Internship>): Promise<Internship | null> => {
    await delay(1000);
    const index = mockInternships.findIndex(internship => internship.id === id);
    if (index === -1) return null;
    
    mockInternships[index] = { ...mockInternships[index], ...updates };
    return mockInternships[index];
  }
};

// Applications API
export const applicationsAPI = {
  getUserApplications: async (userId: string): Promise<Application[]> => {
    await delay(600);
    return mockApplications.filter(app => app.candidateId === userId);
  },

  apply: async (internshipId: string, candidateId: string): Promise<Application> => {
    await delay(1000);
    const internship = mockInternships.find(i => i.id === internshipId);
    if (!internship) throw new Error('Internship not found');

    const newApplication: Application = {
      id: Date.now().toString(),
      internshipId,
      candidateId,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      internship
    };
    
    mockApplications.push(newApplication);
    return newApplication;
  },

  updateStatus: async (applicationId: string, status: Application['status']): Promise<Application | null> => {
    await delay(800);
    const index = mockApplications.findIndex(app => app.id === applicationId);
    if (index === -1) return null;
    
    mockApplications[index].status = status;
    return mockApplications[index];
  },

  getInternshipApplications: async (internshipId: string): Promise<Application[]> => {
    await delay(700);
    return mockApplications.filter(app => app.internshipId === internshipId);
  }
};

// Notifications API
export const notificationsAPI = {
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    await delay(400);
    return mockNotifications.filter(notif => notif.userId === userId);
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await delay(300);
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await delay(500);
    mockNotifications.forEach(notif => {
      if (notif.userId === userId) {
        notif.isRead = true;
      }
    });
  }
};