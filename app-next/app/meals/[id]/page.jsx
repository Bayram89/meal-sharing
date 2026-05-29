import SelectedMeal from "@/components/MealID/SelectedMeal";
import api from "@/utils/api";

async function fetchMeal(id) {
  try {
    const res = await fetch(api(`meals/${id}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch meal:", error);
    return null;
  }
}

export default async function MealPage({ params }) {
  const meal = await fetchMeal(params.id);

  return <SelectedMeal meal={meal} />;
}
