import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { InteractiveInternshipCard } from './InteractiveInternshipCard';
import { User, Internship } from '../types';
import { internshipsAPI, applicationsAPI } from '../utils/api';
import { sectors, locations, skills } from '../data/mockData';
import { Search, Filter, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface InternshipBrowserProps {
  user: User;
}

export function InternshipBrowser({ user }: InternshipBrowserProps) {
  const { t } = useLanguage();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());

  const loadInternships = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await internshipsAPI.getAll();
      setInternships(data);
    } catch (error) {
      console.error('Failed to load internships:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserApplications = useCallback(async () => {
    try {
      const applications = await applicationsAPI.getUserApplications(user.id);
      const appliedIds = new Set(applications.map(app => app.internshipId));
      setAppliedInternships(appliedIds);
    } catch (error) {
      console.error('Failed to load user applications:', error);
    }
  }, [user.id]);

  useEffect(() => {
    loadInternships();
    loadUserApplications();
  }, [loadInternships, loadUserApplications]);

  const applyFilters = useMemo(() => {
    let filtered = [...internships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sector filter
    if (selectedSector && selectedSector !== 'all') {
      filtered = filtered.filter(internship => internship.sector === selectedSector);
    }

    // Location filter
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter(internship => internship.location === selectedLocation);
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(internship =>
        selectedSkills.some(skill =>
          internship.skillsRequired.some(reqSkill =>
            reqSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }, [internships, searchTerm, selectedSector, selectedLocation, selectedSkills]);

  useEffect(() => {
    setFilteredInternships(applyFilters);
  }, [applyFilters]);

  const handleApply = useCallback(async (internshipId: string) => {
    try {
      await applicationsAPI.apply(internshipId, user.id);
      setAppliedInternships(prev => new Set([...prev, internshipId]));
      // Add success toast
      return { success: true };
    } catch (error) {
      console.error('Failed to apply:', error);
      throw error;
    }
  }, [user.id]);

  const handleAddSkill = useCallback(() => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  }, [skillInput, selectedSkills]);

  const handleRemoveSkill = useCallback((skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSector('all');
    setSelectedLocation('all');
    setSelectedSkills([]);
    setSkillInput('');
  }, []);

  const hasActiveFilters = useMemo(() => 
    searchTerm || (selectedSector !== 'all') || (selectedLocation !== 'all') || selectedSkills.length > 0,
    [searchTerm, selectedSector, selectedLocation, selectedSkills]
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" />
            <h3>{t('common.filter')}</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                {t('filter.clearAll')}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('browser.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sector Filter */}
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder={t('internship.sector')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('ui.all')} {t('internship.sector')}</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t('internship.location')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('ui.all')} {t('internship.location')}</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Skills Filter */}
            <div className="flex gap-2">
              <Input
                placeholder={t('filter.skills')}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button variant="outline" size="sm" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(skill => (
                <Badge key={skill} variant="secondary" className="px-2 py-1">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center mb-4">
        <h2>Available Internships ({filteredInternships.length})</h2>
      </div>

      {filteredInternships.length === 0 ? (
        <Alert>
          <AlertDescription>
            {hasActiveFilters 
              ? 'No internships match your current filters. Try adjusting your search criteria.'
              : 'No internships available at the moment. Please check back later.'
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInternships.map((internship) => (
            <InteractiveInternshipCard
              key={internship.id}
              internship={internship}
              isApplied={appliedInternships.has(internship.id)}
              onApply={user.role === 'candidate' ? handleApply : undefined}
              onView={(internship) => console.log('View internship:', internship)}
            />
          ))}
        </div>
      )}
    </div>
  );
}