import React from 'react';
import { CheckCircle, Clock, XCircle, RotateCcw, AlertCircle } from 'lucide-react';

const TaskNode = ({ task, state, retryCount, isDarkMode }) => {
  const getStateIcon = () => {
    switch (state) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      case 'retrying': return <RotateCcw className="w-4 h-4 text-yellow-500 dark:text-yellow-400 animate-spin" />;
      case 'skipped': return <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getStateColor = () => {
    switch (state) {
      case 'completed': return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
      case 'running': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700';
      case 'failed': return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
      case 'retrying': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
      case 'skipped': return 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700';
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${getStateColor()} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStateIcon()}
          <span className="font-medium text-gray-900 dark:text-white">{task.name}</span>
        </div>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
        Duration: {task.duration}ms | Failure Rate: {(task.failureRate * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default TaskNode; 