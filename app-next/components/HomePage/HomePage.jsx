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
        Below you’ll find some of our favorite meals — made with love and care.  
        Choose something that makes you happy, and enjoy every bite.  
        <br /><br />
        Velbekomme! 🍽️
      </p>

      <MealsList />
    </div>
  );
}

export default HomePage;