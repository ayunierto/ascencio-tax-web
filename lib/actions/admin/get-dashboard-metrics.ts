import { api } from '@/lib/api/api';

export interface DashboardMetrics {
  totalUsers: number;
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await api.get<DashboardMetrics>(
      '/admin/dashboard/metrics',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      totalUsers: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      completedAppointments: 0,
    };
  }
}
