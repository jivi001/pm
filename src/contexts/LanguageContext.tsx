import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Language, LanguageContent } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: LanguageContent = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम', ta: 'முகப்பு' },
  'nav.browse': { en: 'Browse Internships', hi: 'इंटर्नशिप देखें', ta: 'பயிற்சி வேலைகளை பார்' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', ta: 'டாஷ்போர்டு' },
  'nav.logout': { en: 'Logout', hi: 'लॉग आउट', ta: 'வெளியேறு' },
  'nav.manageInternships': { en: 'Manage Internships', hi: 'इंटर्नशिप प्रबंधन', ta: 'பயிற்சி வேலைகளை நிர்வகிக்க' },
  'nav.postInternship': { en: 'Post Internship', hi: 'इंटर्नशिप पोस्ट करें', ta: 'பயிற்சி வேலை இடுக' },
  'nav.viewApplications': { en: 'View Applications', hi: 'आवेदन देखें', ta: 'விண்ணப்பங்களை பார்' },

  // Auth
  'auth.login': { en: 'Login', hi: 'लॉगिन', ta: 'உள்நுழை' },
  'auth.register': { en: 'Register', hi: 'रजिस्टर', ta: 'பதிவு செய்' },
  'auth.aadhaar': { en: 'Aadhaar Number', hi: 'आधार संख्या', ta: 'ஆதார் எண்' },
  'auth.companyReg': { en: 'Company Registration Number', hi: 'कंपनी पंजीकरण संख्या', ta: 'நிறுவன பதிவு எண்' },
  'auth.loginAs': { en: 'Login as', hi: 'के रूप में लॉगिन करें', ta: 'என்று உள்நுழை' },
  'auth.name': { en: 'Full Name', hi: 'पूरा नाम', ta: 'முழு பெயர்' },
  'auth.companyName': { en: 'Company Name', hi: 'कंपनी का नाम', ta: 'நிறுவனத்தின் பெயர்' },
  'auth.email': { en: 'Email', hi: 'ईमेल', ta: 'மின்னஞ்சல்' },
  'auth.phone': { en: 'Phone Number', hi: 'फोन नंबर', ta: 'தொலைபேசி எண்' },
  'auth.location': { en: 'Location', hi: 'स्थान', ta: 'இடம்' },
  'auth.skills': { en: 'Skills (comma separated)', hi: 'कौशल (कॉमा से अलग)', ta: 'திறன்கள் (காமாவால் பிரிக்க)' },
  'auth.role': { en: 'Role', hi: 'भूमिका', ta: 'பாத்திரம்' },
  'auth.candidate': { en: 'Candidate', hi: 'उम्मीदवार', ta: 'விண்ணப்பதாரர்' },
  'auth.admin': { en: 'Company/Admin', hi: 'कंपनी/एडमिन', ta: 'நிறுவனம்/நிர्வाकि' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', ta: 'கடவுச்சொல்' },
  'auth.confirmPassword': { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें', ta: 'கடவுச்சொல்லை உறுதிப்படுத்த' },
  'auth.sendOtp': { en: 'Send OTP', hi: 'OTP भेजें', ta: 'OTP அனுப்ப' },
  'auth.verifyOtp': { en: 'Verify OTP', hi: 'OTP सत्यापित करें', ta: 'OTP சரியापித்த செய்' },
  'auth.otp': { en: 'Enter OTP', hi: 'OTP दर्ज करें', ta: 'OTP உல்லிட' },
  'auth.passwordMismatch': { en: 'Passwords do not match', hi: 'पासवर्ड मेल नहीं खाते', ta: 'கடவுச்சொல்கள் பொருந்தாது' },
  'auth.otpSent': { en: 'OTP sent to your phone', hi: 'आपके फोन पर OTP भेजा गया', ta: 'உங்கள் தொலைபேசி எண்ணில் OTP அனுப்பப்பட்டது' },
  'auth.invalidCredentials': { en: 'Invalid credentials', hi: 'गलत क्रेडेंशियल', ta: 'தவறான தரவு' },
  'auth.loginSuccess': { en: 'Login successful!', hi: 'लॉगिन सफल!', ta: 'உள்நுழைவு வெற்றி!' },
  'auth.registerSuccess': { en: 'Registration successful!', hi: 'पंजीकरण सफल!', ta: 'பதிவு வெற்றி!' },
  'auth.demoCredentials': { en: 'Demo Login Credentials:', hi: 'डेमो लॉगिन क्रेडेंशियल:', ta: 'டெமோ உள்நுழைவு தரவு:' },
  'auth.contactPerson': { en: 'Contact Person Name', hi: 'संपर्क व्यक्ति का नाम', ta: 'தோட்டுப்பெயர்' },
  'auth.hrManager': { en: 'HR Manager Name', hi: 'HR प्रबंधक का नाम', ta: 'HR மேலாளர்' },
  'auth.sectorsPlaceholder': { en: 'Technology, Healthcare, Finance', hi: 'प्रौद्योगिकी, स्वास्थ्य, वित्त', ta: 'தொழில்நுட்டம், மருத்துவம், நிதி' },
  'auth.minimumChars': { en: 'Minimum 6 characters', hi: 'न्यूनतम 6 वर्ण', ta: 'குறைந்த 6 அடி' },
  'auth.reenterPassword': { en: 'Re-enter your password', hi: 'अपना पासवर्ड फिर से दर्ज करें', ta: 'உங்கள் கடவுச்சொல்களை மீண்டும் உள்ளிடுக' },
  'auth.demoOtp': { en: 'Demo OTP: 123456 (any 6-digit number for testing)', hi: 'डेमो OTP: 123456 (टेस्टिंग के लिए कोई भी 6 अंक)', ta: 'டெமோ OTP: 123456 (தோல்வியாக ஏதையும் 6 அடிகள்)' },

  // Common
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...', ta: 'தரும் தரும்...' },
  'common.search': { en: 'Search', hi: 'खोजें', ta: 'தேடு' },
  'common.filter': { en: 'Filter', hi: 'फिल्टर', ta: 'துட்டு' },
  'common.apply': { en: 'Apply', hi: 'आवेदन करें', ta: 'நிரைப்பெறு' },
  'common.view': { en: 'View', hi: 'देखें', ta: 'பார்' },
  'common.edit': { en: 'Edit', hi: 'संपादित करें', ta: 'தொகு' },
  'common.delete': { en: 'Delete', hi: 'मिटाएं', ta: 'நீக்கு' },
  'common.save': { en: 'Save', hi: 'सहेजें', ta: 'சேமி' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें', ta: 'ரத்து' },
  'common.error': { en: 'Error', hi: 'त्रुटि', ta: 'பிழை' },

  // UI Elements
  'ui.back': { en: 'Back', hi: 'वापस', ta: 'பின்னை' },
  'ui.next': { en: 'Next', hi: 'अगला', ta: 'அடுத்து' },
  'ui.close': { en: 'Close', hi: 'बंद करें', ta: 'முடு' },
  'ui.reset': { en: 'Reset', hi: 'रीसेट', ta: 'மீட்டமை' },
  'ui.select': { en: 'Select', hi: 'चुनें', ta: 'தேர்ந்தெடு' },
  'ui.all': { en: 'All', hi: 'सभी', ta: 'அனைத்து' },
  'ui.none': { en: 'None', hi: 'कोई नहीं', ta: 'இல்லை' },
  'ui.more': { en: 'More', hi: 'और', ta: 'மேலும்' },
  'ui.less': { en: 'Less', hi: 'कम', ta: 'குறை' },

  // Form Labels
  'form.required': { en: 'Required', hi: 'आवश्यक', ta: 'வேலு' },
  'form.optional': { en: 'Optional', hi: 'वैकल्पिक', ta: 'விருப்பம்' },
  'form.placeholder': { en: 'Enter text...', hi: 'टेक्स्ट दर्ज करें...', ta: 'உரை உள்ளிடுக...' },
  'form.submit': { en: 'Submit', hi: 'जमा करें', ta: 'சமர்ப்பி' },

  // Filters
  'filter.sector': { en: 'Sector', hi: 'क्षेत्र', ta: 'துறை' },
  'filter.location': { en: 'Location', hi: 'स्थान', ta: 'இடம்' },
  'filter.skills': { en: 'Skills', hi: 'कौशल', ta: 'திறன்கள்' },
  'filter.clearAll': { en: 'Clear All Filters', hi: 'सभी फिल्टर साफ़ करें', ta: 'அனைத்து துட்டுகளை மீட்டமை' },
  'filter.applyFilters': { en: 'Apply Filters', hi: 'फिल्टर लागू करें', ta: 'துட்டுகளை நிரைப்பெறு' },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome', hi: 'स्वागत', ta: 'வரவேற்று' },
  'dashboard.applications': { en: 'My Applications', hi: 'मेरे आवेदन', ta: 'என் விண்ணப்பங்கள்' },
  'dashboard.notifications': { en: 'Notifications', hi: 'सूचनाएं', ta: 'அறிவுகள்' },
  'dashboard.profile': { en: 'Profile', hi: 'प्रोफ़ाइल', ta: 'வடிவம்' },
  'dashboard.totalApplications': { en: 'Total Applications', hi: 'कुल आवेदन', ta: 'மொத்த விண்ணப்பங்கள்' },
  'dashboard.activeInternships': { en: 'Active Internships', hi: 'सक्रिय इंटर्नशिप', ta: 'செய்த பயிற்சி வேலைகள்' },
  'dashboard.pendingApplications': { en: 'Pending Applications', hi: 'लंबित आवेदन', ta: 'நிலாவு விண்ணப்பங்கள்' },
  'dashboard.recentActivity': { en: 'Recent Activity', hi: 'हाल की गतिविधि', ta: 'அண்டைய செய்திகள்' },
  'dashboard.quickStats': { en: 'Quick Stats', hi: 'त्वरित आंकड़े', ta: 'விரைவு புதிவுகள்' },
  'dashboard.applicationStatus': { en: 'Application Status', hi: 'आवेदन स्थिति', ta: 'விண்ணப்ப நிலை' },

  // Internships
  'internship.title': { en: 'Internship Title', hi: 'इंटर्नशिप शीर्षक', ta: 'பயிற்சி வேலை தலைப்பு' },
  'internship.company': { en: 'Company', hi: 'कंपनी', ta: 'நிறுவனம்' },
  'internship.location': { en: 'Location', hi: 'स्थान', ta: 'இடம்' },
  'internship.sector': { en: 'Sector', hi: 'क्षेत्र', ta: 'துறை' },
  'internship.duration': { en: 'Duration', hi: 'अवधि', ta: 'வேலை காலம்' },
  'internship.stipend': { en: 'Stipend', hi: 'वेतन', ta: 'உதியான வேலை' },
  'internship.skills': { en: 'Required Skills', hi: 'आवश्यक कौशल', ta: 'வேலு திறன்கள்' },
  'internship.deadline': { en: 'Application Deadline', hi: 'आवेदन की अंतिम तिथि', ta: 'விண்ணப்ப முடிவு' },

  // Internship Browser
  'browser.title': { en: 'Browse Internships', hi: 'इंटर्नशिप देखें', ta: 'பயிற்சி வேலைகளை பார்' },
  'browser.searchPlaceholder': { en: 'Search internships...', hi: 'इंटर्नशिप खोजें...', ta: 'பயிற்சி வேலைகளை தேடு...' },
  'browser.resultsFound': { en: 'results found', hi: 'परिणा मिले', ta: 'நிபைகள் கிட்டது' },
  'browser.noResults': { en: 'No internships found matching your criteria.', hi: 'आपके मानदंडों से मेल खाने वाली कोई इंटर्नशिप नहीं मिली।', ta: 'உங்கள் தோல்வியாக தரவுகள் கிட்டவில்லை।' },
  'browser.tryAdjusting': { en: 'Try adjusting your search or filters.', hi: 'अपनी खोज या फिल्टर को समायोजित करने का प्रयास करें।', ta: 'உங்கள் தேடலை அல்லது துட்டுகளை மீட்டமை முய்ந்து போய்' },

  // Status
  'status.pending': { en: 'Pending', hi: 'लंबित', ta: 'நிலாவு' },
  'status.approved': { en: 'Approved', hi: 'स्वीकृत', ta: 'உதியான' },
  'status.rejected': { en: 'Rejected', hi: 'अस्वीकृत', ta: 'நீக்கப்பட்ட' },
  'status.open': { en: 'Open', hi: 'खुला', ta: 'திறும்' },
  'status.closed': { en: 'Closed', hi: 'बंद', ta: 'முடும்' },

  // Application Status
  'application.applied': { en: 'Applied', hi: 'आवेदन किया', ta: 'நிரைப்பெற்ற' },
  'application.underReview': { en: 'Under Review', hi: 'समीक्षाधीन', ta: 'தீர்வு வேற்றும்' },
  'application.shortlisted': { en: 'Shortlisted', hi: 'शॉर्टलिस्ट', ta: 'தேர்ந்தெடுக்கப்பட்ட' },
  'application.interviewed': { en: 'Interviewed', hi: 'साक्षात्कार', ta: 'வேலை பேசுதல்' },
  'application.selected': { en: 'Selected', hi: 'चयनित', ta: 'தேர்ந்தெடுக்கப்பட்ட' },
  'application.rejected': { en: 'Rejected', hi: 'अस्वीकृत', ta: 'நீக்கப்பட்ட' },

  // Admin Dashboard
  'admin.postInternship': { en: 'Post New Internship', hi: 'नई इंटर्नशिप पोस्ट करें', ta: 'புதிய பயிற்சி வேலை இடு' },
  'admin.manageApplications': { en: 'Manage Applications', hi: 'आवेदन प्रबंधित करें', ta: 'விண்ணப்பங்களை நிர்வகிக்க' },
  'admin.viewAnalytics': { en: 'View Analytics', hi: 'एनालिटिक्स देखें', ta: 'விஶ்லேஷங்களை பார்' },
  'admin.companyProfile': { en: 'Company Profile', hi: 'कंपनी प्रोफाइल', ta: 'நிறுவன வடிவம்' },

  // Notifications
  'notification.newApplication': { en: 'New application received', hi: 'नया आवेदन प्राप्त', ta: 'புதிய விண்ணப்பம் பெற்றது' },
  'notification.statusUpdate': { en: 'Application status updated', hi: 'आवेदन स्थिति अपडेट', ta: 'விண்ணப்ப நிலை புதுப்பிக்கப்பட்டது' },
  'notification.newInternship': { en: 'New internship posted', hi: 'नई इंटर्नशिप पोस्ट', ta: 'புதிய பயிற்சி வேலை இடுப்பட்டது' },
  'notification.markAllRead': { en: 'Mark all as read', hi: 'सभी को पढ़ा हुआ चिह्नित करें', ta: 'அனைத்து படிவுகளை படிவுகள்' },

  // Footer
  'footer.platform': { en: 'PM Internship Skill-Matching Platform', hi: 'PM इंटर्नशिप स्किल-मैचिंग प्लेटफॉर्म', ta: 'PM பயிற்சி வேலை தொடர்பாடு பீட்டம்' },
  'footer.optimized': { en: 'Optimized for low-bandwidth usage', hi: 'कम बैंडविड्थ उपयोग के लिए अनुकूलित', ta: 'குறைந்த வேலை பேசுதல் தொடர்பாடு அனுகும்' },

  // Time and Date
  'time.ago': { en: 'ago', hi: 'पहले', ta: 'முன்பு' },
  'time.minute': { en: 'minute', hi: 'मिनट', ta: 'நிமிடம்' },
  'time.minutes': { en: 'minutes', hi: 'मिनट', ta: 'நிமிடங்கள்' },
  'time.hour': { en: 'hour', hi: 'घंटा', ta: 'மணி' },
  'time.hours': { en: 'hours', hi: 'घंटे', ta: 'மணிகள்' },
  'time.day': { en: 'day', hi: 'दिन', ta: 'நாள்' },
  'time.days': { en: 'days', hi: 'दिन', ta: 'நாட்கள்' },

  // Welcome message
  'welcome.title': { en: 'PM Internship Portal', hi: 'PM इंटर्नशिप पोर्टल', ta: 'PM பயிற்சி வேலை பீட்டம்' },
  'welcome.subtitle': { en: 'Find your perfect internship match', hi: 'अपना सही इंटर्नशिप मैच खोजें', ta: 'உங்கள் சரியான பயிற்சி வேலை தேடு' },

  // Language
  'language.english': { en: 'English', hi: 'अंग्रेजी', ta: 'ஆங்கிலம்' },
  'language.hindi': { en: 'हिन्दी', hi: 'हिन्दी', ta: 'தமிழ்' },
  'language.tamil': { en: 'தமிழ்', hi: 'तमिल', ta: 'தமிழ்' },

  // Profile
  'profile.accountDetails': { en: 'Your account details and skills', hi: 'आपका खाता विवरण और कौशल', ta: 'உங்கள் கணக்கு விவரங்கள் மற்றும் திறன்கள்' },
  'profile.resume': { en: 'Resume / CV', hi: 'बायोडाटा / सीवी', ta: 'வேலை விவரம் / சீவு' },
  'profile.resumeUploadText': { en: 'Upload your resume to improve your application visibility', hi: 'अपनी आवेदन दृश्यता बेहतर करने के लिए बायोडाटा अपलोड करें', ta: 'உங்கள் வேலை விவரம் அதிகரித்து விண்ணப்பத்தை பார்க்க உப்படுத்து' },
  'profile.uploadResume': { en: 'Choose File', hi: 'फाइल चुनें', ta: 'கோப்பை தேர்ந்தெடு' },
  'profile.supportedFormats': { en: 'Supported formats: PDF, DOC, DOCX (Max 5MB)', hi: 'समर्थित प्रारूप: PDF, DOC, DOCX (अधिकतम 5MB)', ta: 'ஆதாரப்படுத்தப்பட்ட வடிவங்கள்: PDF, DOC, DOCX (அதிகப்படுத்துக்கொள்வது 5MB)' },
  'profile.uploadedOn': { en: 'Uploaded on', hi: 'अपलोड किया गया', ta: 'உப்படுத்தப்பட்டது' },
  'profile.replace': { en: 'Replace', hi: 'बदलें', ta: 'நீக்கு மற்றும் இடு' }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}