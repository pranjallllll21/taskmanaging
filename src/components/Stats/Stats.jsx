import React from 'react';

const Stats = ({ stats, isDarkMode }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.total || 0}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
      </div>
      <div className="bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded-lg text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats.pending || 0}</div>
        <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
      </div>
      <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.running || 0}</div>
        <div className="text-sm text-blue-600 dark:text-blue-400">Running</div>
      </div>
      <div className="bg-green-100 dark:bg-green-800/30 p-3 rounded-lg text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.completed || 0}</div>
        <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
      </div>
      <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded-lg text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-red-800 dark:text-red-300">{stats.failed || 0}</div>
        <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
      </div>
      <div className="bg-orange-100 dark:bg-orange-800/30 p-3 rounded-lg text-center transition-colors duration-200">
        <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">{stats.retrying || 0}</div>
        <div className="text-sm text-orange-600 dark:text-orange-400">Retrying</div>
      </div>
    </div>
  );
};

export default Stats; 