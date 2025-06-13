import React from 'react';
import { AlertCircle } from 'lucide-react';

const ExecutionPlan = ({ executionOrder, error, isDarkMode }) => {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-200">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Execution Error</span>
        </div>
        <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors duration-200">
      <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Execution Order</h3>
      <div className="flex flex-wrap gap-2">
        {executionOrder.map((taskId, index) => (
          <div key={taskId} className="flex items-center gap-1">
            <span className="bg-blue-100 dark:bg-blue-700 px-2 py-1 rounded text-sm text-blue-800 dark:text-blue-200">{taskId}</span>
            {index < executionOrder.length - 1 && (
              <span className="text-blue-400 dark:text-blue-500">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionPlan; 