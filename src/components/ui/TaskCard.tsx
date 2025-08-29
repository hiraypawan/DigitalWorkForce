'use client';

import { Clock, DollarSign, Calendar, User, ArrowRight } from 'lucide-react';
import { Card } from './Card';
import { Badge, StatusBadge } from './Badge';
import { Button } from './Button';
import { formatCurrency, formatDate, escapeHtml, sanitizeText } from '@/lib/utils';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description: string;
    status: string;
    estimatedHours: number;
    budget: number;
    deadline: string;
    skills: string[];
    priority?: string;
    jobId?: {
      title: string;
      description: string;
    };
    assignedTo?: {
      name: string;
      _id: string;
    };
  };
  onAction?: (taskId: string, action: string) => void;
  showActions?: boolean;
  userRole?: 'worker' | 'company';
}

export function TaskCard({ 
  task, 
  onAction, 
  showActions = true,
  userRole = 'worker' 
}: TaskCardProps) {
  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const daysRemaining = getDaysRemaining(task.deadline);
  const isUrgent = daysRemaining <= 2;

  return (
    <Card hover className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={task.status} />
        <div className="flex items-center gap-2">
          {task.priority && (
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
          )}
          <Badge 
            variant={isUrgent ? 'danger' : daysRemaining <= 7 ? 'warning' : 'success'}
            size="sm"
          >
            {daysRemaining} days left
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{sanitizeText(task.title)}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{sanitizeText(task.description)}</p>
        </div>

        {/* Project Reference */}
        {task.jobId && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Part of project:</p>
            <p className="font-medium text-gray-900 text-sm">{task.jobId.title}</p>
          </div>
        )}

        {/* Assigned Worker (for company view) */}
        {userRole === 'company' && task.assignedTo && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Assigned to:</span>
            <span className="font-medium text-gray-900">{task.assignedTo.name}</span>
          </div>
        )}

        {/* Skills Required */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Skills required:</p>
          <div className="flex flex-wrap gap-1">
            {task.skills.map((skill, index) => (
              <Badge key={index} variant="info" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {task.estimatedHours}h
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(task.budget)}
            </div>
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {task.status === 'pending' && userRole === 'worker' && (
                <Button
                  size="sm"
                  onClick={() => onAction?.(task._id, 'apply')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Apply
                </Button>
              )}
              
              {task.status === 'assigned' && userRole === 'worker' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onAction?.(task._id, 'start')}
                >
                  Start Work
                </Button>
              )}
              
              {task.status === 'in_progress' && userRole === 'worker' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction?.(task._id, 'complete')}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
