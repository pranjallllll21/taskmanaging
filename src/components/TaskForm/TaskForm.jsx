import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TaskForm = ({ onSubmit, existingTasks }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: 1,
    failureRate: 0,
    dependencies: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      duration: 1,
      failureRate: 0.1,
      dependencies: []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'failureRate' ? parseFloat(value) : value
    }));
  };

  const handleDependencyChange = (e) => {
    const options = e.target.options;
    const selectedDependencies = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedDependencies.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      dependencies: selectedDependencies
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Task</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter task name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            required
            placeholder="Enter duration in seconds"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Failure Rate (0-1)
          </label>
          <input
            type="number"
            id="failureRate"
            name="failureRate"
            value={formData.failureRate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="1"
            step="0.1"
            required
            placeholder="Enter failure rate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dependencies
          </label>
          <select
            id="dependencies"
            name="dependencies"
            multiple
            value={formData.dependencies}
            onChange={handleDependencyChange}
            className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {existingTasks.map(task => (
              <option key={task.id} value={task.id} className="text-gray-900">
                {task.id}: {task.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple dependencies
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    </form>
  );
};

export default TaskForm; 