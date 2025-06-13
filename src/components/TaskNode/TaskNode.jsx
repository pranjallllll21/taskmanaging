import React from 'react';
import { CheckCircle, Clock, XCircle, RotateCcw, AlertCircle } from 'lucide-react';

const TaskNode = ({ task, state, retryCount }) => {
  const getStateIcon = () => {
    switch (state) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'retrying': return <RotateCcw className="w-4 h-4 text-yellow-500 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStateColor = () => {
    switch (state) {
      case 'completed': return 'bg-green-100 border-green-300';
      case 'running': return 'bg-blue-100 border-blue-300';
      case 'failed': return 'bg-red-100 border-red-300';
      case 'retrying': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${getStateColor()} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStateIcon()}
          <span className="font-medium">{task.name}</span>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        Duration: {task.duration}ms | Failure Rate: {(task.failureRate * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default TaskNode; 