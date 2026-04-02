export interface DashboardStats {
  overview: DashboardOverview;
  attendees: DashboardAttendees;
  tasks: DashboardTasks[];
}

export interface DashboardAttendees {
  vegCount: number;
  nonVegCount: number;
  clubWise: DashboardClubWise[];
}

export interface DashboardClubWise {
  name: string;
  count: number;
}

export interface DashboardTasks {
  id: number;
  name: string;
  completed: number;
  total: number;
}

export interface DashboardOverview {
  totalAttendees: number;
  totalTasks: number;
  totalSponsors: number;
}
