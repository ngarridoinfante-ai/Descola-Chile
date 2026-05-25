import type {
  UserProfile,
  DailyLog,
  NutritionLog,
  WorkoutPlan,
  WorkoutSession,
} from "@/types/fit40.types";

export const MOCK_PROFILE: UserProfile = {
  id: "mock-user-1",
  name: "Nicolás",
  age: 42,
  height_cm: 178,
  start_weight_kg: 92,
  current_weight_kg: 88.4,
  goal: "cut",
  level: "intermediate",
  training_days: [1, 2, 4, 5], // lun, mar, jue, vie
  activity_level: "light",
  injuries: "Leve molestia en hombro derecho",
  food_prefs: "Sin restricciones",
  body_fat_pct: 22,
  created_at: "2025-03-01T00:00:00Z",
  updated_at: "2025-05-20T00:00:00Z",
};

export const MOCK_WEIGHT_LOGS: DailyLog[] = [
  { id: "1", user_id: "mock-user-1", log_date: "2025-05-05", weight_kg: 90.1, created_at: "" },
  { id: "2", user_id: "mock-user-1", log_date: "2025-05-06", weight_kg: 89.8, created_at: "" },
  { id: "3", user_id: "mock-user-1", log_date: "2025-05-07", weight_kg: 89.5, created_at: "" },
  { id: "4", user_id: "mock-user-1", log_date: "2025-05-08", weight_kg: 89.3, created_at: "" },
  { id: "5", user_id: "mock-user-1", log_date: "2025-05-09", weight_kg: 89.6, created_at: "" },
  { id: "6", user_id: "mock-user-1", log_date: "2025-05-12", weight_kg: 89.0, created_at: "" },
  { id: "7", user_id: "mock-user-1", log_date: "2025-05-13", weight_kg: 88.7, created_at: "" },
  { id: "8", user_id: "mock-user-1", log_date: "2025-05-14", weight_kg: 88.9, created_at: "" },
  { id: "9", user_id: "mock-user-1", log_date: "2025-05-15", weight_kg: 88.5, created_at: "" },
  { id: "10", user_id: "mock-user-1", log_date: "2025-05-16", weight_kg: 88.4, created_at: "" },
  { id: "11", user_id: "mock-user-1", log_date: "2025-05-19", weight_kg: 88.2, created_at: "" },
  { id: "12", user_id: "mock-user-1", log_date: "2025-05-20", weight_kg: 88.0, created_at: "" },
  { id: "13", user_id: "mock-user-1", log_date: "2025-05-21", weight_kg: 88.4, created_at: "" },
  { id: "14", user_id: "mock-user-1", log_date: "2025-05-22", weight_kg: 88.1, created_at: "" },
  { id: "15", user_id: "mock-user-1", log_date: "2025-05-23", weight_kg: 87.9, created_at: "" },
];

export const MOCK_NUTRITION_LOGS: NutritionLog[] = [
  {
    id: "n1", user_id: "mock-user-1", log_date: "2025-05-23",
    food_text: "3 huevos revueltos, 200g pechuga de pollo a la plancha, arroz integral 150g, 1 scoop whey, yogurt proteico, 1 manzana",
    protein_g: 185, carbs_g: 210, fat_g: 45, calories: 1985,
    ai_notes: "Buena ingesta de proteína. Podrías agregar más verduras.",
    created_at: "", updated_at: "",
  },
  {
    id: "n2", user_id: "mock-user-1", log_date: "2025-05-22",
    food_text: "Avena con proteína, carne molida 250g, papas cocidas, queso cottage",
    protein_g: 175, carbs_g: 195, fat_g: 48, calories: 1900,
    ai_notes: "", created_at: "", updated_at: "",
  },
  {
    id: "n3", user_id: "mock-user-1", log_date: "2025-05-21",
    food_text: "2 huevos, salmón 200g, quinoa, espinaca, aceite de oliva",
    protein_g: 165, carbs_g: 140, fat_g: 52, calories: 1740,
    ai_notes: "Calorías un poco bajas para tu objetivo.", created_at: "", updated_at: "",
  },
];

export const MOCK_WORKOUT_PLAN: WorkoutPlan = {
  id: "plan-1",
  user_id: "mock-user-1",
  name: "PPL Intermedio 4 días",
  day_of_week: [1, 2, 4, 5],
  is_active: true,
  exercises: [
    { id: "e1", plan_id: "plan-1", name: "Press Banca", muscle_group: "chest", sets: 4, rep_min: 6, rep_max: 8, order_index: 1 },
    { id: "e2", plan_id: "plan-1", name: "Press Inclinado", muscle_group: "chest", sets: 3, rep_min: 8, rep_max: 12, order_index: 2 },
    { id: "e3", plan_id: "plan-1", name: "Press Militar", muscle_group: "shoulders", sets: 3, rep_min: 8, rep_max: 10, order_index: 3 },
    { id: "e4", plan_id: "plan-1", name: "Fondos en paralelas", muscle_group: "chest", sets: 3, rep_min: 8, rep_max: 12, order_index: 4 },
  ],
  created_at: "2025-03-01T00:00:00Z",
};

export const MOCK_SESSIONS: WorkoutSession[] = [
  {
    id: "s1",
    user_id: "mock-user-1",
    plan_id: "plan-1",
    session_date: "2025-05-22",
    status: "completed",
    duration_min: 58,
    overall_rpe: 7,
    notes: "Buena sesión, hombro bien",
    exercises: [
      {
        id: "el1", session_id: "s1", plan_exercise_id: "e1",
        name: "Press Banca", muscle_group: "chest", order_index: 1,
        progression_flag: "increase",
        sets: [
          { id: "sl1", exercise_log_id: "el1", set_number: 1, reps_done: 8, weight_kg: 80, rpe: 7, rest_seconds: 120 },
          { id: "sl2", exercise_log_id: "el1", set_number: 2, reps_done: 8, weight_kg: 80, rpe: 7, rest_seconds: 120 },
          { id: "sl3", exercise_log_id: "el1", set_number: 3, reps_done: 8, weight_kg: 80, rpe: 8, rest_seconds: 120 },
          { id: "sl4", exercise_log_id: "el1", set_number: 4, reps_done: 8, weight_kg: 80, rpe: 8, rest_seconds: 120 },
        ],
      },
    ],
    created_at: "2025-05-22T10:00:00Z",
  },
];

export const MOCK_AI_RECOMMENDATION =
  "Tu progreso esta semana es sólido: -0.5 kg de promedio. Proteína promedio en 175g, un poco bajo para tu peso. Intenta llegar a 180g hoy. Si el hombro sigue molestando en press banca, considera bajar a 75 kg y agregar más trabajo de manguito rotador.";
