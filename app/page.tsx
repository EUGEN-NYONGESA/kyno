import AnimatedHome from "@/components/AnimatedHome";
import Footer from "@/components/Footer";
import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/actions/companion.actions";

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <div>
      <AnimatedHome
        companions={companions}
        recentSessionsCompanions={recentSessionsCompanions}
      />
      <Footer />
    </div>
  );
};

export default Page;
