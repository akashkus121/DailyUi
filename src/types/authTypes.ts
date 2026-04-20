export  interface LoginRequest{
   Email:string;
   Password:string;
   RememberMe:boolean;
}

export interface UserRegisterRequest {
    Name: string;
    Email: string;
    Password: string;
    AvatarUrl:string;

}
export interface submitDailyHealth {
    SleepHours: number;
    FoodItems:string;
     Mood: number;
  Drink: number;
}


export interface HealthData {
  createdAt: string;
  sleepHours: number;
  mood: number;
  drink: number;
  foodItems: string;
}

export interface HealthReport {
  fromDate: string;
  toDate: string;
  healthData: HealthData[];
  aiSuggestion: string;
}

export interface Expense {
  createdAt: string;
  amount: number;
}

export interface PendingWage {
  id: number;
  personName: string;
  amount: number;
  isReturned: boolean;
}

export interface ExpenseReport {
  salary: number;
  totalExpenses: number;
  netSavings: number;
  pendingWages: PendingWage[];
  expenseList: Expense[];
}

// Dashboard / Health / Expense models used by the UI (mapped shapes)
export interface DailyHealthCheck {
  Id: number;
  Mood: string;
  SleepHours: number;
  Drink?: number;
  CreatedAt: string;
}

export interface ExpenseEntry {
  Id: number;
  UserId: number | null;
  Amount: number;
  Category: string;
  Note?: string;
  CreatedAt: string;
}

export interface MoneyGiven {
  Id: number;
  userId: number;
  Amount: number;
  PersonName: string;
  IsReturned: boolean;
  GivenAt: string;
  ReturnedAt?: string;
}

export interface LifeScoreResult {
  HealthScore: number;
  ExpenseScore: number;
  TotalScore: number;
  Message: string;
  Date: string;
}

export interface DashboardData {
  dashboard: DailyHealthCheck[];
  ExpenseList: ExpenseEntry[];
  PendingWages: MoneyGiven[];
  LifeScores: LifeScoreResult[];
}