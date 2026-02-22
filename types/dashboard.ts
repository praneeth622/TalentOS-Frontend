/**
 * Dashboard statistics from GET /api/dashboard/stats
 */
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  assignedTasks: number;
  completedTasks: number;
}

/**
 * One row in the productivity leaderboard from GET /api/dashboard/leaderboard
 */
export interface LeaderboardEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  productivityScore: number;
  completedTasks: number;
  totalTasks: number;
}

/**
 * One activity entry from GET /api/dashboard/activity
 */
export interface ActivityLog {
  id: string;
  title: string;
  status: string;
  priority: string;
  updatedAt: string;
  employeeName: string;
  employeeId: string;
}

/**
 * Personal stats for the employee dashboard (GET /api/dashboard/stats when called as employee)
 */
export interface EmployeePersonalStats {
  assignedTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  totalTasks: number;
  productivityScore: number;
  recentActivity: Array<{
    title: string;
    status: string;
    updatedAt: string;
  }>;
}

/**
 * A single task returned from GET /api/tasks/my-tasks
 */
export interface MyTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  completedAt: string | null;
  txHash: string | null;
  skillRequired: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Employee's own profile from GET /api/employees/me
 */
export interface MyProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[];
  walletAddress: string | null;
  roleType: string;
  isActive: boolean;
  createdAt: string;
  tasks: MyTask[];
}

/**
 * Employee productivity score from GET /api/employees/me/score
 */
export interface MyScore {
  employeeId: string;
  employeeName: string;
  finalScore: number;
  completionRate: number;
  deadlineScore: number;
  priorityScore: number;
  breakdown: {
    totalTasks: number;
    completedTasks: number;
    onTimeTasks: number;
    highPriorityTotal: number;
    highPriorityCompleted: number;
  };
}
