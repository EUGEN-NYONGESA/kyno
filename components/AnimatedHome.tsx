"use client";

import { motion } from "framer-motion";
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import { getSubjectColor } from "@/lib/utils";

interface AnimatedHomeProps {
  companions: any[];
  recentSessionsCompanions: any[];
}

const AnimatedHome = ({
  companions,
  recentSessionsCompanions,
}: AnimatedHomeProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 bg-content-bg h-full max-w-[1400px] pt-8 pb-8 rounded-3xl shadow-2xl my-4 backdrop-blur-sm"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
      >
        Popular Companions
      </motion.h1>

      {/* Companions Grid - Equal cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-6 justify-center w-full"
      >
        {companions.map((companion, index) => (
          <motion.div
            key={companion.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="equal-cards"
          >
            <CompanionCard
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          </motion.div>
        ))}
      </motion.section>

      {/* Companion List and CTA Section - Simple 2/3 vs 1/3 split */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="home-section"
      >
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </motion.section>
    </motion.main>
  );
};

export default AnimatedHome;