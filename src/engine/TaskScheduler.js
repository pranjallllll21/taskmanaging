// Task Scheduler Engine
/**
 * TaskScheduler manages tasks with dependencies, retries, and state tracking.
 * - Tasks can be added with dependencies.
 * - Tasks are executed in dependency order.
 * - Failed tasks are retried up to maxRetries.
 * - If a dependency fails, dependents are skipped and marked with the failed dependency.
 */
class TaskScheduler {
  constructor() {
    this.tasks = new Map();
    this.taskStates = new Map();
    this.retryCounts = new Map();
    this.maxRetries = 3;
    this.onStateChange = null;
    this.skippedDueTo = new Map(); // taskId -> failed dependency
  }

  /**
   * Add a new task to the scheduler.
   * @param {Object} task - Task object with id, name, duration, failureRate, dependencies
   */
  addTask(task) {
    if (!task.id || !task.name || typeof task.duration !== 'number' || task.duration <= 0) {
      throw new Error('Invalid task: missing required fields or invalid duration');
    }
    if (task.dependencies) {
      for (const depId of task.dependencies) {
        if (!this.tasks.has(depId)) {
          throw new Error(`Invalid dependency: task ${depId} does not exist`);
        }
      }
    }
    this.tasks.set(task.id, task);
    this.taskStates.set(task.id, 'pending');
    this.retryCounts.set(task.id, 0);
    this.skippedDueTo.delete(task.id);
  }

  /**
   * Remove a task from the scheduler.
   * @param {string} taskId - The ID of the task to remove.
   */
  removeTask(taskId) {
    this.tasks.delete(taskId);
    this.taskStates.delete(taskId);
    this.retryCounts.delete(taskId);
    this.skippedDueTo.delete(taskId);
  }

  /**
   * Get a valid execution order (topological sort).
   * Throws on circular dependencies.
   */
  getExecutionOrder() {
    const visited = new Set();
    const temp = new Set();
    const order = [];
    const visit = (taskId) => {
      if (temp.has(taskId)) throw new Error('Circular dependency detected');
      if (visited.has(taskId)) return;
      temp.add(taskId);
      const task = this.tasks.get(taskId);
      if (task.dependencies) {
        for (const depId of task.dependencies) {
          visit(depId);
        }
      }
      temp.delete(taskId);
      visited.add(taskId);
      order.push(taskId);
    };
    for (const taskId of this.tasks.keys()) {
      if (!visited.has(taskId)) visit(taskId);
    }
    return order;
  }

  /**
   * Execute all tasks in dependency order, skipping those blocked by failed dependencies.
   */
  async execute() {
    const executionOrder = this.getExecutionOrder();
    const pendingTasks = new Set(executionOrder);
    while (pendingTasks.size > 0) {
      let executedAny = false;
      for (const taskId of pendingTasks) {
        const task = this.tasks.get(taskId);
        const state = this.taskStates.get(taskId);
        // If any dependency failed, skip this task
        if (task.dependencies) {
          const failedDep = task.dependencies.find(depId => this.taskStates.get(depId) === 'failed');
          if (failedDep) {
            this.taskStates.set(taskId, 'skipped');
            this.skippedDueTo.set(taskId, failedDep);
            this.notifyStateChange(taskId, 'skipped');
            pendingTasks.delete(taskId);
            executedAny = true;
            continue;
          }
        }
        // If all dependencies are completed, run the task
        if (state === 'pending' && this.canExecute(task)) {
          await this.executeTask(task);
          pendingTasks.delete(taskId);
          executedAny = true;
        }
      }
      if (!executedAny) break; // No progress, avoid infinite loop
    }
  }

  /**
   * Check if all dependencies are completed.
   */
  canExecute(task) {
    if (!task.dependencies) return true;
    return task.dependencies.every(depId => this.taskStates.get(depId) === 'completed');
  }

  /**
   * Execute a single task, retrying on failure up to maxRetries.
   */
  async executeTask(task) {
    let currentAttempt = 0; // 0 for initial attempt, then 1, 2, ... for retries
    while (currentAttempt <= this.maxRetries) {
      const stateBeforeExecution = currentAttempt === 0 ? 'running' : 'retrying';
      this.taskStates.set(task.id, stateBeforeExecution);
      this.notifyStateChange(task.id, stateBeforeExecution);

      try {
        await this.simulateTaskExecution(task);
        this.taskStates.set(task.id, 'completed');
        this.notifyStateChange(task.id, 'completed');
        return; // Task completed successfully
      } catch (error) {
        currentAttempt++;
        this.retryCounts.set(task.id, currentAttempt); // Store how many retries have been attempted

        if (currentAttempt > this.maxRetries) { // No more retries left
          this.taskStates.set(task.id, 'failed');
          this.notifyStateChange(task.id, 'failed');
          return; // Task failed after max retries
        }
        // If currentAttempt <= this.maxRetries, the loop will continue
        // and set the state to 'retrying' at the beginning of the next iteration.
      }
    }
  }

  /**
   * Simulate task execution with random failure.
   */
  async simulateTaskExecution(task) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < task.failureRate) {
          reject(new Error(`Task ${task.id} failed`));
        } else {
          resolve();
        }
      }, task.duration);
    });
  }

  /**
   * Notify listeners of a state change.
   */
  notifyStateChange(taskId, state) {
    if (this.onStateChange) {
      this.onStateChange(taskId, state, this.retryCounts.get(taskId));
    }
  }

  /**
   * Get statistics for all task states.
   */
  getStats() {
    const stats = {
      total: 0, // Calculate total based on states found
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      retrying: 0,
      skipped: 0
    };

    // Iterate over the canonical list of tasks
    for (const taskId of this.tasks.keys()) {
      let state = this.taskStates.get(taskId);

      // If a task doesn't have a state, or has an invalid state, default to 'pending'
      if (!state || stats[state] === undefined) {
        state = 'pending';
      }
      stats[state]++;
      stats.total++; // Increment total for each task successfully processed
    }
    return stats;
  }

  /**
   * Get details for a specific task.
   */
  getTaskDetails(taskId) {
    return {
      ...this.tasks.get(taskId),
      state: this.taskStates.get(taskId),
      retryCount: this.retryCounts.get(taskId) || 0,
      skippedDueTo: this.skippedDueTo.get(taskId) || null
    };
  }

  /**
   * Reset the scheduler to its initial state.
   */
  reset() {
    this.tasks.clear();
    this.taskStates.clear();
    this.retryCounts.clear();
    this.skippedDueTo.clear();
  }
}

export default TaskScheduler; 