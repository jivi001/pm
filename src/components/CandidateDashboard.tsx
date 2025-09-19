import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { InternshipCard } from './InternshipCard';
import { User, Application, Notification } from '../types';
import { applicationsAPI, notificationsAPI } from '../utils/api';
import { Bell, BellOff, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface CandidateDashboardProps {
  user: User;
  onNotificationUpdate: (count: number) => void;
}

export function CandidateDashboard({ user, onNotificationUpdate }: CandidateDashboardProps) {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userApplications, userNotifications] = await Promise.all([
        applicationsAPI.getUserApplications(user.id),
        notificationsAPI.getUserNotifications(user.id)
      ]);
      
      setApplications(userApplications);
      setNotifications(userNotifications);
      
      // Update unread count
      const unreadCount = userNotifications.filter(n => !n.isRead).length;
      onNotificationUpdate(unreadCount);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, onNotificationUpdate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      
      // Update unread count
      const unreadCount = notifications.filter(n => !n.isRead && n.id !== notificationId).length;
      onNotificationUpdate(unreadCount);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [notifications, onNotificationUpdate]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      onNotificationUpdate(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [user.id, onNotificationUpdate]);

  const stats = useMemo(() => {
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    return { pending, approved, rejected, total: applications.length };
  }, [applications]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="applications" className="flex-1 md:flex-none">
            {t('dashboard.applications')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 md:flex-none">
            {t('dashboard.notifications')}
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 md:flex-none">
            {t('dashboard.profile')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3>Your Applications ({applications.length})</h3>
            </div>
            
            {applications.length === 0 ? (
              <Alert>
                <AlertDescription>
                  You haven't applied to any internships yet. Browse available internships to get started!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {applications.map((application) => (
                  <InternshipCard
                    key={application.id}
                    internship={application.internship}
                    isApplied={true}
                    applicationStatus={application.status}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3>Your Notifications ({notifications.length})</h3>
              {notifications.some(n => !n.isRead) && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  <BellOff className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No notifications yet. You'll receive updates about your applications here.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={notification.isRead ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Bell className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            notification.isRead ? 'text-muted-foreground' : 'text-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.profile')}</CardTitle>
              <CardDescription>{t('profile.accountDetails')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">{t('auth.name')}</label>
                  <p>{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t('auth.email')}</label>
                  <p>{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t('auth.phone')}</label>
                  <p>{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t('auth.location')}</label>
                  <p>{user.location}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t('auth.skills')}</label>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Resume Upload Section */}
              <div className="border-t pt-6">
                <h4 className="mb-4">{t('profile.resume')}</h4>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t('profile.resumeUploadText')}
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // In a real app, this would upload to server
                            console.log('Resume uploaded:', file.name);
                          }
                        }}
                      />
                      <label
                        htmlFor="resume-upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 cursor-pointer"
                      >
                        {t('profile.uploadResume')}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {t('profile.supportedFormats')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Sample uploaded resume display */}
                  <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-medium">resume_candidate.pdf</p>
                        <p className="text-xs text-muted-foreground">
                          {t('profile.uploadedOn')}: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {t('common.view')}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('profile.replace')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}