import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, AlertCircle, Trash2, Sun, Moon } from 'lucide-react';
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
  const [acknowledgedFailedTasks, setAcknowledgedFailedTasks] = useState(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Watch for task state changes
  useEffect(() => {
    userTasks.forEach(task => {
      const state = taskStates.get(task.id);
      if (state === 'failed') {
        // Log current state before attempting to set failedTask
        console.log(`[useEffect] Task ${task.id} current state: ${state}. FailedTask state: ${failedTask?.id ? failedTask.name : 'null'}. Acknowledged: ${acknowledgedFailedTasks.has(task.id)}`);
        
        if (!failedTask && !acknowledgedFailedTasks.has(task.id)) {
          console.log(`[useEffect] Setting failed task: ID=${task.id}, Name=${task.name}`);
          setFailedTask(task);
        }
      }
    });
  }, [taskStates, userTasks, failedTask, acknowledgedFailedTasks]);

  const handleCloseFailurePopup = useCallback(() => {
    console.log(`[handleCloseFailurePopup] Dismissing popup for task: ${failedTask?.id}`);
    if (failedTask) {
      setAcknowledgedFailedTasks(prev => {
        const newSet = new Set(prev).add(failedTask.id);
        console.log(`[handleCloseFailurePopup] Acknowledged tasks after dismiss:`, newSet);
        return newSet;
      });
    }
    setFailedTask(null);
  }, [failedTask]);

  // Log failedTask?.name before rendering
  console.log(`[render] Rendering FailurePopup. failedTask?.name: ${failedTask?.name}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header with Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors duration-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Distributed Task Scheduler
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Add your tasks and define their dependencies
              </p>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>

          {/* Task Form */}
          <TaskForm onSubmit={addTask} existingTasks={userTasks} isDarkMode={isDarkMode} />

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={execute}
              disabled={isRunning || executionError || userTasks.length === 0}
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Start Execution'}
            </button>
            <button
              onClick={() => {
                console.log('[reset] Resetting application states.');
                reset();
                setFailedTask(null);
                setAcknowledgedFailedTasks(new Set());
                console.log('[reset] States after reset: failedTask=null, acknowledgedFailedTasks=empty Set');
              }}
              className="flex items-center gap-2 bg-gray-600 dark:bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Stats */}
          <Stats stats={stats} isDarkMode={isDarkMode} />

          {/* Deadlock Warning */}
          {deadlockDetected && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-colors duration-200">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Deadlock Detected!</span>
              </div>
              <p className="text-red-600 dark:text-red-300 mt-1">
                No pending tasks can be executed due to failed dependencies.
              </p>
            </div>
          )}

          {/* Execution Plan */}
          <ExecutionPlan executionOrder={executionOrder} error={executionError} isDarkMode={isDarkMode} />
        </div>

        {/* Task Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Task Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTasks.map(task => (
              <div key={task.id} className="relative">
                <TaskNode
                  task={task}
                  state={taskStates.get(task.id) || 'pending'}
                  retryCount={retryStates.get(task.id) || 0}
                  isDarkMode={isDarkMode}
                />
                <button
                  onClick={() => removeTask(task.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
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
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default App;