import { useState, useCallback } from 'react';
import TaskScheduler from '../engine/TaskScheduler';

const useTaskScheduler = () => {
  const [scheduler] = useState(() => new TaskScheduler());
  const [taskStates, setTaskStates] = useState(new Map());
  const [retryStates, setRetryStates] = useState(new Map());
  const [executionOrder, setExecutionOrder] = useState([]);
  const [executionError, setExecutionError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    retrying: 0,
    skipped: 0
  });
  const [deadlockDetected, setDeadlockDetected] = useState(false);
  const [userTasks, setUserTasks] = useState([]);
  const [nextTaskId, setNextTaskId] = useState(1);

  const handleStateChange = useCallback((taskId, state, retryCount) => {
    setTaskStates(prev => {
      const next = new Map(prev);
      next.set(taskId, state);
      return next;
    });

    setRetryStates(prev => {
      const next = new Map(prev);
      next.set(taskId, retryCount);
      return next;
    });

    setStats(prev => {
      const next = { ...prev };
      // Decrement previous state count if task is transitioning from a state
      const previousState = taskStates.get(taskId);
      if (previousState && next[previousState] !== undefined) {
        next[previousState]--;
      }
      // Increment new state count
      if (next[state] !== undefined) {
        next[state]++;
      }
      return next;
    });
  }, [taskStates]); // Added taskStates to dependencies to correctly decrement previous state

  const addTask = useCallback((taskData) => {
    const task = {
      id: `task-${nextTaskId}`,
      name: taskData.name,
      duration: taskData.duration * 1000, // Convert seconds to milliseconds
      failureRate: taskData.failureRate,
      dependencies: taskData.dependencies
    };

    try {
      scheduler.addTask(task);
      setUserTasks(prev => [...prev, task]);
      setTaskStates(prev => {
        const next = new Map(prev);
        next.set(task.id, 'pending');
        return next;
      });
      setRetryStates(prev => {
        const next = new Map(prev);
        next.set(task.id, 0);
        return next;
      });
      setNextTaskId(prev => prev + 1);
      setExecutionOrder(scheduler.getExecutionOrder());
      setExecutionError(null);
      setDeadlockDetected(false);
      // Manually update stats for new task
      setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));

    } catch (error) {
      setExecutionError(error.message);
    }
  }, [nextTaskId, scheduler]);

  const removeTask = useCallback((taskId) => {
    const taskToRemove = userTasks.find(t => t.id === taskId);
    if (!taskToRemove) return;

    scheduler.tasks.delete(taskId);
    setUserTasks(prev => prev.filter(task => task.id !== taskId));

    setTaskStates(prev => {
      const next = new Map(prev);
      next.delete(taskId);
      return next;
    });
    setRetryStates(prev => {
      const next = new Map(prev);
      next.delete(taskId);
      return next;
    });
    // Manually update stats for removed task
    setStats(prev => {
      const next = { ...prev };
      const previousState = taskStates.get(taskId);
      if (previousState && next[previousState] !== undefined) {
        next[previousState]--;
      }
      next.total--;
      return next;
    });

    setExecutionOrder(scheduler.getExecutionOrder());
    setExecutionError(null);
    setDeadlockDetected(false);
  }, [scheduler, userTasks, taskStates]);

  const reset = useCallback(() => {
    scheduler.reset();
    setUserTasks([]);
    setTaskStates(new Map());
    setRetryStates(new Map());
    setExecutionOrder([]);
    setExecutionError(null);
    setIsRunning(false);
    setStats({
      total: 0,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      retrying: 0,
      skipped: 0
    });
    setDeadlockDetected(false);
    setNextTaskId(1);
  }, [scheduler]);

  const execute = useCallback(async () => {
    setIsRunning(true);
    setExecutionError(null);
    setDeadlockDetected(false);

    try {
      scheduler.onStateChange = handleStateChange;
      await scheduler.execute();
    } catch (error) {
      if (error.message.includes('Deadlock')) {
        setDeadlockDetected(true);
      }
      setExecutionError(error.message);
    } finally {
      setIsRunning(false);
      scheduler.onStateChange = null;
    }
  }, [scheduler, handleStateChange]);

  return {
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
  };
};

export default useTaskScheduler; 