import Link from "next/link";
import { CalendarDays, MapPin, ShieldCheck, Star } from "lucide-react";
import "./HomePage.css";
import MealsList from "@/components/MealsList/MealsList";

function HomePage() {
  return (
    <div className="homepageShell">
      <section className="heroPanel">
        <div className="heroCopy">
          <p className="eyebrow">Social dining in Copenhagen</p>
          <h1>Meet people over great food.</h1>
          <p className="heroText">
            Discover hosted dining experiences across Copenhagen. Small groups,
            verified hosts, and memorable conversations around the table.
          </p>

          <div className="heroActions">
            <Link href="/meals" className="primaryAction">
              Browse experiences
            </Link>
            <p className="heroNote">
              Real people, real tables, and enough detail to know what kind of
              evening you are saying yes to.
            </p>
          </div>
        </div>

        <div className="heroDetails">
          <div className="heroCard">
            <div className="heroCardLabel">Why people trust it</div>
            <ul className="valueList">
              <li>
                <ShieldCheck className="valueIcon" />
                Hosts are visible before you book
              </li>
              <li>
                <CalendarDays className="valueIcon" />
                Seat availability feels real, not vague
              </li>
              <li>
                <MapPin className="valueIcon" />
                Each table has its own mood and setting
              </li>
            </ul>
          </div>

          <div className="heroStatRow">
            <div className="statCard">
              <span className="statValue">10</span>
              <span className="statLabel">Upcoming gatherings</span>
            </div>
            <div className="statCard">
              <span className="statValue">5.0</span>
              <span className="statLabel">
                <Star className="inlineStar" />
                guest experience
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
