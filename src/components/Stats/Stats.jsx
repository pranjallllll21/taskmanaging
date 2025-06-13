import React from 'react';

const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div className="bg-gray-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-gray-800">{stats.total || 0}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="bg-yellow-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-yellow-800">{stats.pending || 0}</div>
        <div className="text-sm text-yellow-600">Pending</div>
      </div>
      <div className="bg-blue-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-800">{stats.running || 0}</div>
        <div className="text-sm text-blue-600">Running</div>
      </div>
      <div className="bg-green-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-green-800">{stats.completed || 0}</div>
        <div className="text-sm text-green-600">Completed</div>
      </div>
      <div className="bg-red-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-red-800">{stats.failed || 0}</div>
        <div className="text-sm text-red-600">Failed</div>
      </div>
      <div className="bg-orange-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-orange-800">{stats.retrying || 0}</div>
        <div className="text-sm text-orange-600">Retrying</div>
      </div>
    </div>
  );
};

export default Stats; 