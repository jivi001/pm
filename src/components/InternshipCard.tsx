import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Internship } from '../types';
import { MapPin, Calendar, IndianRupee, Clock, Building, Users } from 'lucide-react';
import { applicationsAPI } from '../utils/api';
import { Alert, AlertDescription } from './ui/alert';

interface InternshipCardProps {
  internship: Internship;
  isApplied?: boolean;
  applicationStatus?: 'pending' | 'approved' | 'rejected';
  onApply?: (internshipId: string) => void;
  showManageButton?: boolean;
  onManage?: (internshipId: string) => void;
}

export function InternshipCard({ 
  internship, 
  isApplied = false, 
  applicationStatus,
  onApply,
  showManageButton = false,
  onManage
}: InternshipCardProps) {
  const { t } = useLanguage();
  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  const handleApply = async () => {
    if (!onApply) return;
    
    setIsApplying(true);
    try {
      await onApply(internship.id);
      setApplicationMessage('Application submitted successfully!');
    } catch (error) {
      setApplicationMessage('Failed to submit application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-6 mb-1">{internship.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm">
              <Building className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{internship.company}</span>
            </CardDescription>
          </div>
          {isApplied && applicationStatus && (
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(applicationStatus)}`}>
              {t(`status.${applicationStatus}`)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span>{internship.location}</span>
            <Badge variant="outline" className="text-xs">{internship.sector}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>{internship.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3 text-muted-foreground" />
              <span>{formatCurrency(internship.stipend)}/month</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">{t('internship.skills')}:</p>
          <div className="flex flex-wrap gap-1">
            {internship.skillsRequired.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {internship.skillsRequired.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{internship.skillsRequired.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 flex-1 overflow-hidden" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>
          {internship.description}
        </p>

        {applicationMessage && (
          <Alert className="mb-3">
            <AlertDescription className="text-sm">{applicationMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 mt-auto">
          {!isApplied && !showManageButton && (
            <Button 
              onClick={handleApply}
              disabled={isApplying || internship.status === 'closed'}
              className="flex-1"
              size="sm"
            >
              {isApplying ? t('common.loading') : t('common.apply')}
            </Button>
          )}
          
          {showManageButton && onManage && (
            <Button 
              onClick={() => onManage(internship.id)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Users className="h-4 w-4 mr-1" />
              Manage Applications
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            {t('common.view')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}