import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
  isBookmarksEnabled,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionList";
import Link from "next/link";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);
  const bookmarksEnabled = await isBookmarksEnabled();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-primary/20 p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-4 lg:gap-6 flex-1">
              <div className="relative">
                <Image
                  src={user.imageUrl}
                  alt={user.firstName!}
                  width={120}
                  height={120}
                  className="rounded-3xl border-4 border-white shadow-2xl"
                />
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex flex-col gap-3">
                <h1 className="font-bold text-2xl lg:text-3xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm lg:text-base text-gray-600">
                  {user.emailAddresses[0].emailAddress}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                    Active Learner
                  </span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                    {companions.length} Companions
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4 lg:gap-6">
              {/* Lessons Completed */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-4 lg:p-6 gap-3 flex flex-col h-fit shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex gap-2 items-center">
                  <div className="bg-green-500 p-2 rounded-xl shadow-md">
                    <Image
                      src="/icons/check.png"
                      alt="checkmark"
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {sessionHistory.length}
                  </p>
                </div>
                <div className="text-sm lg:text-base font-medium text-gray-700">
                  Lessons Completed
                </div>
              </div>

              {/* Companions Created */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-4 lg:p-6 gap-3 flex flex-col h-fit shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex gap-2 items-center">
                  <div className="bg-blue-500 p-2 rounded-xl shadow-md">
                    <Image 
                      src="/icons/cap.png" 
                      alt="cap" 
                      width={20} 
                      height={20} 
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {companions.length}
                  </p>
                </div>
                <div className="text-sm lg:text-base font-medium text-gray-700">
                  Companions Created
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Journey Section */}
        <section className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              My Learning Journey
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Track your progress, manage your companions, and continue your learning adventure
            </p>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {/* Bookmarks Section - Conditionally Rendered */}
            {bookmarksEnabled ? (
              <AccordionItem value="bookmarks" className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden">
                <AccordionTrigger className="text-xl lg:text-2xl font-bold px-6 py-4 hover:bg-primary/5 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 p-2 rounded-lg shadow-md">
                      <Image 
                        src="/icons/bookmarks.png" 
                        alt="bookmarks" 
                        width={20} 
                        height={20} 
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <span>Bookmarked Companions</span>
                    <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                      {bookmarkedCompanions.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {bookmarkedCompanions.length > 0 ? (
                    <CompanionsList
                      companions={bookmarkedCompanions}
                      title="Bookmarked Companions"
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl flex items-center justify-center">
                        <Image 
                          src="/icons/bookmarks.png" 
                          alt="bookmarks" 
                          width={40} 
                          height={40} 
                          className="opacity-60"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-700 mb-2">
                        No bookmarks yet
                      </h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Start bookmarking your favorite companions to easily access them later!
                      </p>
                      <Link 
                        href="/companions"
                        className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                      >
                        <Image 
                          src="/icons/explore.png" 
                          alt="explore" 
                          width={16} 
                          height={16} 
                          className="filter brightness-0 invert"
                        />
                        Explore Companions
                      </Link>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <AccordionItem value="bookmarks" disabled className="bg-gray-50/80 rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <AccordionTrigger className="text-xl lg:text-2xl font-bold px-6 py-4 text-gray-400 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-400 p-2 rounded-lg shadow-md">
                      <Image 
                        src="/icons/bookmarks.png" 
                        alt="bookmarks" 
                        width={20} 
                        height={20} 
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <span>Bookmarked Companions</span>
                    <span className="bg-gray-400 text-white text-sm px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                      <Image 
                        src="/icons/upgrade.png" 
                        alt="upgrade" 
                        width={40} 
                        height={40} 
                        className="opacity-60"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      Bookmarks Feature Coming Soon!
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      We're upgrading the bookmarks feature to make it even better. Stay tuned for the update!
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Recent Sessions */}
            <AccordionItem value="recent" className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden">
              <AccordionTrigger className="text-xl lg:text-2xl font-bold px-6 py-4 hover:bg-primary/5 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg shadow-md">
                    <Image 
                      src="/icons/chronometer.png" 
                      alt="sessions" 
                      width={20} 
                      height={20} 
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <span>Recent Sessions</span>
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                    {sessionHistory.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {sessionHistory.length > 0 ? (
                  <CompanionsList
                    title="Recent Sessions"
                    companions={sessionHistory}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center">
                      <Image 
                        src="/icons/chronometer.png" 
                        alt="sessions" 
                        width={40} 
                        height={40} 
                        className="opacity-60"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      No sessions yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start learning with companions to see your session history here!
                    </p>
                    <Link 
                      href="/companions"
                      className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                    >
                      <Image 
                        src="/icons/play.png" 
                        alt="play" 
                        width={16} 
                        height={16} 
                        className="filter brightness-0 invert"
                      />
                      Start Learning
                    </Link>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* My Companions */}
            <AccordionItem value="companions" className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden">
              <AccordionTrigger className="text-xl lg:text-2xl font-bold px-6 py-4 hover:bg-primary/5 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-md">
                    <Image 
                      src="/icons/cap.png" 
                      alt="companions" 
                      width={20} 
                      height={20} 
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <span>My Companions</span>
                  <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                    {companions.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {companions.length > 0 ? (
                  <CompanionsList title="My Companions" companions={companions} />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center">
                      <Image 
                        src="/icons/cap.png" 
                        alt="companions" 
                        width={40} 
                        height={40} 
                        className="opacity-60"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      No companions created yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Create your first AI learning companion to start your personalized learning journey!
                    </p>
                    <Link 
                      href="/companions/new"
                      className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                    >
                      <Image 
                        src="/icons/plus.png" 
                        alt="create" 
                        width={16} 
                        height={16} 
                        className="filter brightness-0 invert"
                      />
                      Create First Companion
                    </Link>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Quick Actions Footer */}
        <div className="text-center mt-12 pt-8 border-t border-primary/20">
          <p className="text-gray-600 mb-4">
            Ready to continue your learning journey?
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/companions"
              className="btn-primary hover:scale-105 transition-transform duration-200"
            >
              <Image 
                src="/icons/explore.png" 
                alt="explore" 
                width={16} 
                height={16} 
                className="filter brightness-0 invert"
              />
              Explore Library
            </Link>
            <Link 
              href="/companions/new"
              className=" flex items-center gap-2 border-2 border-primary text-primary rounded-2xl px-6 py-3 font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Image 
                src="/icons/add.png" 
                alt="create" 
                width={16} 
                height={16} 
              />
              Create New Companion
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;