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
