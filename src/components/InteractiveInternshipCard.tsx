import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Internship } from '../types';
import { MapPin, Clock, DollarSign, Calendar, Building2, Users, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InteractiveInternshipCardProps {
  internship: Internship;
  isApplied?: boolean;
  onApply?: (id: string) => Promise<{success: boolean}>;
  onView?: (internship: Internship) => void;
}

export function InteractiveInternshipCard({ 
  internship, 
  isApplied = false, 
  onApply,
  onView 
}: InteractiveInternshipCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleApply = async () => {
    if (onApply) {
      try {
        const result = await onApply(internship.id);
        if (result.success) {
          toast.success(t('application.applied') + ' - ' + internship.title);
        }
      } catch (error) {
        toast.error(t('common.error') + ': ' + (error as Error).message);
      }
    }
  };

  const handleView = () => {
    if (onView) {
      onView(internship);
    }
  };

  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5 }
  };

  const contentVariants = {
    rest: { opacity: 0.8 },
    hover: { opacity: 1 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate={isHovered ? "hover" : "rest"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-colors duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <motion.div 
              variants={contentVariants}
              className="flex-1"
            >
              <CardTitle className="text-lg leading-tight mb-2">{internship.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mb-2">
                <Building2 className="h-4 w-4" />
                {internship.company}
              </CardDescription>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Star className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <motion.div variants={contentVariants} className="space-y-3">
            {/* Location and Duration */}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {internship.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {internship.duration}
              </div>
            </div>

            {/* Stipend and Deadline */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <DollarSign className="h-3 w-3" />
                ₹{internship.stipend?.toLocaleString() || 'Unpaid'}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(internship.deadline).toLocaleDateString()}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('internship.skills')}:</p>
              <div className="flex flex-wrap gap-1">
                {internship.skillsRequired.slice(0, 3).map(skill => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
                {internship.skillsRequired.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{internship.skillsRequired.length - 3} {t('ui.more')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description Preview */}
            <motion.p 
              variants={contentVariants}
              className="text-sm text-muted-foreground line-clamp-2"
            >
              {internship.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={contentVariants}
              className="flex gap-2 pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleView}
                  className="w-full"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {t('common.view')}
                </Button>
              </motion.div>
              
              {onApply && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    size="sm"
                    onClick={handleApply}
                    disabled={isApplied}
                    className="w-full"
                  >
                    {isApplied ? t('application.applied') : t('common.apply')}
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge 
                variant={internship.status === 'open' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {t(`status.${internship.status}`)}
              </Badge>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}