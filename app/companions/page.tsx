import { getAllCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { Link } from "lucide-react";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  const companions = await getAllCompanions({ subject, topic });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="text-center mb-12">
          {/* Main Title */}
          <div className="relative mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-teal-600 bg-clip-text text-transparent relative z-10 py-4">
              Companion Library
            </h1>

            {/* Decorative Elements */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-primary-hover rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full opacity-40"></div>

            {/* Floating particles */}
            <div className="absolute -top-2 -left-4 w-3 h-3 bg-primary rounded-full opacity-60 animate-bounce"></div>
            <div
              className="absolute -top-4 -right-4 w-2 h-2 bg-purple-500 rounded-full opacity-40 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute -bottom-4 left-10 w-2 h-2 bg-teal-500 rounded-full opacity-50 animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Description */}
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover amazing learning companions tailored to your interests.
            Filter by subject or search for specific topics to find your perfect
            study partner.
          </p>

          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex-1 w-full lg:max-w-md">
              <SearchInput />
            </div>
            <div className="w-full lg:w-auto">
              <SubjectFilter />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p className="text-sm lg:text-base">
              <span className="font-semibold text-primary">
                {companions.length}
              </span>
              {companions.length === 1
                ? " companion found"
                : " companions available"}
            </p>
          </div>
        </section>

        {/* Companions Grid */}
        <section className="companions-grid">
          {companions.length > 0 ? (
            companions.map((companion) => (
              <CompanionCard
                key={companion.id}
                {...companion}
                color={getSubjectColor(companion.subject)}
              />
            ))
          ) : (
            // Empty State
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  No companions found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or browse all subjects to
                  discover available companions.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Show All Companions
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Footer Note */}
        {companions.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-primary/20">
            <p className="text-gray-500 text-sm">
              Can't find what you're looking for?{" "}
              <Link
                to="/companions/new"
                className="text-primary hover:text-primary-hover font-semibold transition-colors duration-200 underline"
              >
                Create a custom companion
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CompanionsLibrary;
