import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, AlertCircle, Trash2 } from 'lucide-react';
import TaskForm from './components/TaskForm/TaskForm';
import TaskNode from './components/TaskNode/TaskNode';
import ExecutionPlan from './components/ExecutionPlan/ExecutionPlan';
import Stats from './components/Stats/Stats';
import FailurePopup from './components/FailurePopup/FailurePopup';
import useTaskScheduler from './hooks/useTaskScheduler';

const App = () => {
  const {
    userTasks,
    taskStates,
    retryStates,
    executionOrder,
    executionError,
    isRunning,
    stats,
    deadlockDetected,
    addTask,
    removeTask,
    reset,
    execute
  } = useTaskScheduler();

  const [failedTask, setFailedTask] = useState(null);

  // Watch for task state changes
  useEffect(() => {
    userTasks.forEach(task => {
      const state = taskStates.get(task.id);
      if (state === 'failed') {
        setFailedTask(task);
      }
    });
  }, [taskStates, userTasks]);

  const handleCloseFailurePopup = useCallback(() => {
    setFailedTask(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Distributed Task Scheduler
          </h1>
          <p className="text-gray-600 mb-6">
            Add your tasks and define their dependencies
          </p>

          {/* Task Form */}
          <TaskForm onSubmit={addTask} existingTasks={userTasks} />

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={execute}
              disabled={isRunning || executionError || userTasks.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Start Execution'}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Stats */}
          <Stats stats={stats} />

          {/* Deadlock Warning */}
          {deadlockDetected && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Deadlock Detected!</span>
              </div>
              <p className="text-red-600 mt-1">
                No pending tasks can be executed due to failed dependencies.
              </p>
            </div>
          )}

          {/* Execution Plan */}
          <ExecutionPlan executionOrder={executionOrder} error={executionError} />
        </div>

        {/* Task Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTasks.map(task => (
              <div key={task.id} className="relative">
              <TaskNode
                task={task}
                state={taskStates.get(task.id) || 'pending'}
                retryCount={retryStates.get(task.id) || 0}
              />
                <button
                  onClick={() => removeTask(task.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  title="Remove task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Failure Popup */}
      {failedTask && (
        <FailurePopup
          taskName={failedTask.name}
          onClose={handleCloseFailurePopup}
        />
      )}
    </div>
  );
};

export default App;