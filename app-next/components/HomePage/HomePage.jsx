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
              Small dining experiences hosted by locals, chefs, and food lovers
              across Copenhagen.
            </p>
          </div>
        </div>

        <div className="heroDetails">
          <div className="heroCard">
            <div className="heroCardLabel">Why people keep coming back</div>
            <ul className="valueList">
              <li>
                <ShieldCheck className="valueIcon" />
                You know who you'll be dining with
              </li>
              <li>
                <CalendarDays className="valueIcon" />
                Know exactly how many seats are available
              </li>
              <li>
                <MapPin className="valueIcon" />
                Every table offers a different experience
              </li>
            </ul>
          </div>

          <div className="heroStatRow">
            <div className="statCard">
              <span className="statValue">10</span>
              <span className="statLabel">upcoming tables</span>
            </div>
            <div className="statCard">
              <span className="statValue">42</span>
              <span className="statLabel">guests joined this month</span>
            </div>
            <div className="statCard">
              <span className="statValue">4.8</span>
              <span className="statStars" aria-label="Average guest rating 4.8 out of 5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="statStarIcon" fill="currentColor" />
                ))}
              </span>
              <span className="statLabel">average guest rating</span>
            </div>
          </div>
        </div>
      </section>

      <MealsList />
    </div>
  );
}

export default HomePage;
