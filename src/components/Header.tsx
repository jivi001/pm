import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/button';
import { User } from '../types';
import { LogOut, Bell } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderProps {
  user: User | null;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  unreadNotifications?: number;
}

export function Header({ user, currentView, onViewChange, onLogout, unreadNotifications = 0 }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg">{t('welcome.title')}</h1>
          
          {user && (
            <nav className="hidden md:flex space-x-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('dashboard')}
              >
                {t('nav.dashboard')}
              </Button>
              
              {user.role === 'candidate' && (
                <Button
                  variant={currentView === 'browse' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('browse')}
                >
                  {t('nav.browse')}
                </Button>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Button
                    variant={currentView === 'manage' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange('manage')}
                  >
                    {t('nav.manageInternships')}
                  </Button>
                  <Button
                    variant={currentView === 'applications' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange('applications')}
                  >
                    {t('nav.viewApplications')}
                  </Button>
                </>
              )}
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          
          {user && (
            <>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.name} ({user.role})
                </span>
                {unreadNotifications > 0 && (
                  <div className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      {user && (
        <nav className="md:hidden mt-3 flex space-x-2 max-w-6xl mx-auto">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('dashboard')}
            className="flex-1"
          >
            {t('nav.dashboard')}
          </Button>
          
          {user.role === 'candidate' && (
            <Button
              variant={currentView === 'browse' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('browse')}
              className="flex-1"
            >
              {t('nav.browse')}
            </Button>
          )}
          
          {user.role === 'admin' && (
            <>
              <Button
                variant={currentView === 'manage' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('manage')}
                className="flex-1"
              >
                {t('nav.manageInternships')}
              </Button>
              <Button
                variant={currentView === 'applications' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('applications')}
                className="flex-1"
              >
                {t('nav.viewApplications')}
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}