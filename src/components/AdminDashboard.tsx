import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { InternshipCard } from './InternshipCard';
import { Badge } from './ui/badge';
import { User, Internship, Application } from '../types';
import { internshipsAPI, applicationsAPI } from '../utils/api';
import { sectors, locations, skills } from '../data/mockData';
import { Plus, Users, FileText, TrendingUp, Building } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AdminDashboardProps {
  user: User;
  activeTab?: string;
}

export function AdminDashboard({ user, activeTab = 'overview' }: AdminDashboardProps) {
  const { t } = useLanguage();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInternshipApplications, setSelectedInternshipApplications] = useState<Application[]>([]);
  const [showApplications, setShowApplications] = useState(false);

  const [newInternship, setNewInternship] = useState({
    title: '',
    company: user.name.includes('Admin') ? user.name.replace(' Admin', '') : 'Your Company',
    sector: sectors[0] || 'Technology',
    location: locations[0] || 'Mumbai',
    duration: '',
    stipend: 0,
    skillsRequired: [] as string[],
    description: '',
    status: 'open' as 'open' | 'closed',
    deadline: ''
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [allInternships] = await Promise.all([
        internshipsAPI.getAll()
      ]);
      
      // In a real app, filter by company/admin
      setInternships(allInternships);
      
      // Load applications for all internships
      const allApplications: Application[] = [];
      for (const internship of allInternships) {
        const internshipApplications = await applicationsAPI.getInternshipApplications(internship.id);
        allApplications.push(...internshipApplications);
      }
      setApplications(allApplications);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await internshipsAPI.create(newInternship);
      setInternships(prev => [created, ...prev]);
      setNewInternship({
        title: '',
        company: user.name.includes('Admin') ? user.name.replace(' Admin', '') : 'Your Company',
        sector: sectors[0] || 'Technology',
        location: locations[0] || 'Mumbai',
        duration: '',
        stipend: 0,
        skillsRequired: [],
        description: '',
        status: 'open',
        deadline: ''
      });
      setSkillInput('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create internship:', error);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !newInternship.skillsRequired.includes(skillInput.trim())) {
      setNewInternship(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setNewInternship(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skill)
    }));
  };

  const handleManageApplications = async (internshipId: string) => {
    try {
      const internshipApplications = await applicationsAPI.getInternshipApplications(internshipId);
      setSelectedInternshipApplications(internshipApplications);
      setShowApplications(true);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      await applicationsAPI.updateStatus(applicationId, status);
      setSelectedInternshipApplications(prev => 
        prev.map(app => app.id === applicationId ? { ...app, status } : app)
      );
      setApplications(prev => 
        prev.map(app => app.id === applicationId ? { ...app, status } : app)
      );
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const getStats = () => {
    const totalInternships = internships.length;
    const openInternships = internships.filter(i => i.status === 'open').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;

    return { totalInternships, openInternships, totalApplications, pendingApplications };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
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

  if (showApplications) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2>Manage Applications</h2>
          <Button variant="outline" onClick={() => setShowApplications(false)}>
            Back to Dashboard
          </Button>
        </div>

        {selectedInternshipApplications.length === 0 ? (
          <Alert>
            <AlertDescription>No applications found for this internship.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {selectedInternshipApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4>Application #{application.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                      <Badge 
                        className={`mt-2 ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {t(`status.${application.status}`)}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateApplicationStatus(application.id, 'approved')}
                        disabled={application.status === 'approved'}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                        disabled={application.status === 'rejected'}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
                <p className="text-sm text-muted-foreground">Total Internships</p>
                <p className="text-2xl">{stats.totalInternships}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Positions</p>
                <p className="text-2xl text-green-600">{stats.openInternships}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl">{stats.totalApplications}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl text-yellow-600">{stats.pendingApplications}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab === 'manage' ? 'internships' : activeTab === 'applications' ? 'applications' : 'internships'} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="internships" className="flex-1 md:flex-none">
            {t('nav.manageInternships')}
          </TabsTrigger>
          <TabsTrigger value="create" className="flex-1 md:flex-none">
            {t('admin.postInternship')}
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex-1 md:flex-none">
            {t('admin.manageApplications')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="internships" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3>Your Posted Internships ({internships.length})</h3>
            </div>
            
            {internships.length === 0 ? (
              <Alert>
                <AlertDescription>
                  You haven't posted any internships yet. Create your first internship posting!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {internships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    showManageButton={true}
                    onManage={handleManageApplications}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Internship</CardTitle>
              <CardDescription>Post a new internship opportunity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateInternship} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('internship.title')}</Label>
                    <Input
                      id="title"
                      value={newInternship.title}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">{t('internship.company')}</Label>
                    <Input
                      id="company"
                      value={newInternship.company}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, company: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">{t('internship.sector')}</Label>
                    <Select 
                      value={newInternship.sector}
                      onValueChange={(value) => setNewInternship(prev => ({ ...prev, sector: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t('internship.location')}</Label>
                    <Select 
                      value={newInternship.location}
                      onValueChange={(value) => setNewInternship(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">{t('internship.duration')}</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 3 months"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, duration: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stipend">{t('internship.stipend')}</Label>
                    <Input
                      id="stipend"
                      type="number"
                      value={newInternship.stipend}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, stipend: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">{t('internship.deadline')}</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newInternship.deadline}
                      onChange={(e) => setNewInternship(prev => ({ ...prev, deadline: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('internship.skills')}</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                  {newInternship.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newInternship.skillsRequired.map(skill => (
                        <Badge key={skill} variant="secondary" className="px-2 py-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newInternship.description}
                    onChange={(e) => setNewInternship(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Internship
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3>{t('admin.manageApplications')} ({applications.length})</h3>
            </div>
            
            {applications.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No applications received yet. Applications will appear here when candidates apply to your internships.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const internship = internships.find(i => i.id === application.internshipId);
                  return (
                    <Card key={application.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4>Application #{application.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              For: {internship?.title || 'Unknown Position'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                            </p>
                            <Badge 
                              className={`mt-2 ${
                                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {t(`status.${application.status}`)}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateApplicationStatus(application.id, 'approved')}
                              disabled={application.status === 'approved'}
                            >
                              {t('status.approved')}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                              disabled={application.status === 'rejected'}
                            >
                              {t('status.rejected')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}