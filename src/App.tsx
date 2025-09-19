import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthForm } from './components/AuthForm';
import { CandidateDashboard } from './components/CandidateDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { InternshipBrowser } from './components/InternshipBrowser';
import { User } from './types';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user session on app load
  useEffect(() => {
    const loadSavedUser = () => {
      try {
        const savedUser = localStorage.getItem('pm-internship-user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('pm-internship-user');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent flash
    const timer = setTimeout(loadSavedUser, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('pm-internship-user', JSON.stringify(userData));
    setCurrentView('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pm-internship-user');
    setCurrentView('dashboard');
    setUnreadNotifications(0);
  }, []);

  const handleViewChange = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  const handleNotificationUpdate = useCallback((count: number) => {
    setUnreadNotifications(count);
  }, []);

  const renderCurrentView = useMemo(() => {
    if (!user) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
          <AuthForm onLogin={handleLogin} />
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return user.role === 'candidate' ? (
          <CandidateDashboard 
            user={user} 
            onNotificationUpdate={handleNotificationUpdate}
          />
        ) : (
          <AdminDashboard user={user} />
        );
      case 'browse':
        return user.role === 'candidate' ? <InternshipBrowser user={user} /> : null;
      case 'manage':
        return user.role === 'admin' ? <AdminDashboard user={user} activeTab="manage" /> : null;
      case 'applications':
        return user.role === 'admin' ? <AdminDashboard user={user} activeTab="applications" /> : null;
      default:
        return user.role === 'candidate' ? (
          <CandidateDashboard 
            user={user} 
            onNotificationUpdate={handleNotificationUpdate}
          />
        ) : (
          <AdminDashboard user={user} />
        );
    }
  }, [user, currentView, handleNotificationUpdate]);

  if (isLoading) {
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </LanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header
            user={user}
            currentView={currentView}
            onViewChange={handleViewChange}
            onLogout={handleLogout}
            unreadNotifications={unreadNotifications}
          />
          
          <main className="flex-1">
            <ErrorBoundary>
              {renderCurrentView}
            </ErrorBoundary>
          </main>
          
          <Footer />
          
          <Toaster />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}