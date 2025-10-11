import "./HomePage.css";
import MealsList from "@/components/MealsList/MealsList";
import "@/components/MealsList/MealsList.css";


function HomePage() {
  return (
    <div className="homepage">
      <h1>Welcome to our Meal Sharing page</h1>
      <p className="intro">
        We’re glad you stopped by! 👋  
        Just like in a Danish kitchen, we believe food tastes better when it's shared.  
        Everything you see below was made with heart. Pick something that looks good, and enjoy it like you're at a friend’s table. 
        <br /><br />
        Bon appétit! 🍽️
      </p>

      <MealsList />
    </div>
  );
}

export default HomePage;