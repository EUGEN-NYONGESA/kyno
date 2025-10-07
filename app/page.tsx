import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import Cta from "@/components/CTA";
import { recentSessions } from "@/constants";

function page() {
  return (
    <main>
      <h1>Popular Companions</h1>

      <section className="home-section">
        <CompanionCard
          id="123"
          name="The Good Shepherd"
          topic="The 'I Am' Statements of Jesus"
          subject="C.R.E"
          duration={30}
          color="#22C55E"
        />
        <CompanionCard
          id="124"
          name="The Algorithmic Mind"
          topic="Demystifying AI & Machine Learning"
          subject="IT & Computer Science"
          duration={30}
          color="#D1D5DB"
        />
        <CompanionCard
          id="125"
          name="The Wired Brain"
          topic="Neuroscience of Learning & Well-being"
          subject="Biology & Physics"
          duration={30}
          color="#3B82F6"
        />
      </section>

      <section className="home-section">
        <CompanionList
          title="Recently Completed Sessions"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  );
}

export default page;
