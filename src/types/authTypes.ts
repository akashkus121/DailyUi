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