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