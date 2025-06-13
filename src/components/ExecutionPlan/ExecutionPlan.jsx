import React from 'react';
import { AlertCircle } from 'lucide-react';

const ExecutionPlan = ({ executionOrder, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Execution Error</span>
        </div>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-2">Execution Order</h3>
      <div className="flex flex-wrap gap-2">
        {executionOrder.map((taskId, index) => (
          <div key={taskId} className="flex items-center gap-1">
            <span className="bg-blue-100 px-2 py-1 rounded text-sm">{taskId}</span>
            {index < executionOrder.length - 1 && (
              <span className="text-blue-400">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionPlan; 