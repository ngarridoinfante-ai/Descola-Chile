export type Goal = "cut" | "recomp" | "lean_bulk";
export type Level = "beginner" | "intermediate" | "advanced";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type WeightStatus = "dropping_well" | "stalled" | "dropping_fast" | "gaining";
export type ProgressionFlag = "increase" | "maintain" | "decrease" | null;
export type WorkoutStatus = "planned" | "in_progress" | "completed" | "skipped";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height_cm: number;
  start_weight_kg: number;
  current_weight_kg: number;
  goal: Goal;
  level: Level;
  training_days: number[];
  activity_level: ActivityLevel;
  injuries: string;
  food_prefs: string;
  body_fat_pct?: number;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  weight_kg: number;
  notes?: string;
  sleep_hours?: number;
  energy_level?: number;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  log_date: string;
  food_text: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  calories: number;
  ai_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  day_of_week: number[];
  is_active: boolean;
  exercises: PlanExercise[];
  created_at: string;
}

export interface PlanExercise {
  id: string;
  plan_id: string;
  name: string;
  muscle_group: string;
  sets: number;
  rep_min: number;
  rep_max: number;
  order_index: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id?: string;
  session_date: string;
  status: WorkoutStatus;
  duration_min?: number;
  overall_rpe?: number;
  notes?: string;
  exercises: ExerciseLog[];
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  session_id: string;
  plan_exercise_id?: string;
  name: string;
  muscle_group: string;
  order_index: number;
  progression_flag: ProgressionFlag;
  sets: SetLog[];
}

export interface SetLog {
  id: string;
  exercise_log_id: string;
  set_number: number;
  reps_done: number;
  weight_kg: number;
  rpe: number;
  rest_seconds?: number;
  notes?: string;
}

export interface MacroTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface WeeklyAverage {
  week_start: string;
  avg_weight: number;
  avg_calories: number;
  avg_protein: number;
}

export interface DashboardData {
  profile: UserProfile;
  today_weight?: number;
  weekly_avg_weight?: number;
  targets: MacroTargets;
  weight_status: WeightStatus;
  today_nutrition?: NutritionLog;
  today_session?: WorkoutSession;
  ai_recommendation?: string;
}
