import Link from "next/link";
import { CalendarDays, MapPin, ShieldCheck, Star } from "lucide-react";
import "./HomePage.css";
import MealsList from "@/components/MealsList/MealsList";

function HomePage() {
  return (
    <div className="homepageShell">
      <section className="heroPanel">
        <div className="heroCopy">
          <p className="eyebrow">Copenhagen supper clubs</p>
          <h1>Shared meals that feel hosted, not mass produced.</h1>
          <p className="heroText">
            Discover carefully curated dinners across the city, from candlelit
            tasting menus to relaxed neighborhood nights. Every listing is built
            to feel personal, bookable, and real.
          </p>

          <div className="heroActions">
            <Link href="/meals" className="primaryAction">
              Browse upcoming meals
            </Link>
            <p className="heroNote">
              Small guest counts, clear pricing, and thoughtful hosting details.
            </p>
          </div>
        </div>

        <div className="heroDetails">
          <div className="heroCard">
            <div className="heroCardLabel">What guests value</div>
            <ul className="valueList">
              <li>
                <ShieldCheck className="valueIcon" />
                Clear details before booking
              </li>
              <li>
                <CalendarDays className="valueIcon" />
                Timed events with realistic availability
              </li>
              <li>
                <MapPin className="valueIcon" />
                Copenhagen neighborhoods, not generic placeholders
              </li>
            </ul>
          </div>

          <div className="heroStatRow">
            <div className="statCard">
              <span className="statValue">10</span>
              <span className="statLabel">Curated meals</span>
            </div>
            <div className="statCard">
              <span className="statValue">5.0</span>
              <span className="statLabel">
                <Star className="inlineStar" />
                guest sentiment
              </span>
            </div>
          </div>
        </div>
      </section>

      <MealsList />
    </div>
  );
}

export default HomePage;
