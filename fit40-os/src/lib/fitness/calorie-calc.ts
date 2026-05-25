import type { UserProfile, MacroTargets } from "@/types/fit40.types";

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR(weight_kg: number, height_cm: number, age: number): number {
  // Mifflin-St Jeor for men
  return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
}

export function calculateTDEE(profile: UserProfile, currentWeight: number): number {
  const bmr = calculateBMR(currentWeight, profile.height_cm, profile.age);
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activity_level] ?? 1.375;
  return bmr * multiplier;
}

export function calculateTargets(profile: UserProfile, currentWeight: number): MacroTargets {
  const tdee = calculateTDEE(profile, currentWeight);

  let calorieAdjustment = 0;
  if (profile.goal === "cut") calorieAdjustment = -400;
  else if (profile.goal === "lean_bulk") calorieAdjustment = +250;

  const calories = Math.round(tdee + calorieAdjustment);
  const protein_g = Math.round(currentWeight * 2.0);
  const fat_g = Math.round((calories * 0.25) / 9);
  const carbs_g = Math.round((calories - protein_g * 4 - fat_g * 9) / 4);

  return { calories, protein_g, carbs_g: Math.max(carbs_g, 50), fat_g };
}

export function estimateBodyFatPct(weight_kg: number, height_cm: number, age: number): number {
  // Simple estimation formula for men (Deurenberg)
  const bmi = weight_kg / Math.pow(height_cm / 100, 2);
  return 1.2 * bmi + 0.23 * age - 16.2;
}
