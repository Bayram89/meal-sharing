import SelectedMeal from "@/components/MealID/SelectedMeal";
import api from "@/utils/api";

async function fetchMeal(id) {
  const res = await fetch(api(`meals/${id}`), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch meal");
  return res.json();
}

export default async function MealPage({ params }) {
  const meal = await fetchMeal(params.id);

  return <SelectedMeal meal={meal} />;
}
