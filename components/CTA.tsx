"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.01,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="cta-section relative overflow-hidden flex flex-col items-center justify-between text-center px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
    >
      {/* Gradient background overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-600"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      />

      {/* Top Content */}
      <div className="flex flex-col items-center gap-6 relative z-10 w-full max-w-md">
        <motion.div
          className="cta-badge"
          whileHover={{
            scale: 1.05,
            rotate: [-2, 2, -2],
          }}
          transition={{
            scale: { duration: 0.2 },
            rotate: { duration: 0.6, repeat: Infinity },
          }}
        >
          Start learning your way.
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Build and Personalize Learning Companion
        </motion.h2>

        <motion.p
          className="text-sm sm:text-base text-gray-100/90 max-w-[90%] mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Pick a name, subject, voice & personality — and start learning
          through voice conversations that feel natural and fun.
        </motion.p>
      </div>

      {/* Middle Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, 0],
        }}
        className="relative z-10 flex justify-center w-full"
      >
        <Image
          src="/images/cta.svg"
          alt="cta"
          width={400}
          height={300}
          className="w-[240px] sm:w-[320px] lg:w-[400px] h-auto"
        />
      </motion.div>

      {/* Bottom Button */}
      <motion.div
        className="relative z-10 w-full max-w-[280px] sm:max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/companions/new" className="block w-full">
          <motion.button
            className="btn-primary w-full justify-center group/btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/icons/plus.png"
                alt="plus"
                width={16}
                height={16}
                className="filter brightness-0 invert"
              />
            </motion.div>
            <span className="text-base lg:text-lg">
              Build a New Companion
            </span>
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default CTA;
