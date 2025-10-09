"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center py-6 mt-10">
      <motion.h2
        className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide"
        initial={{ opacity: 0.7 }}
        animate={{ 
          opacity: [0.7, 1, 0.8, 1], 
          textShadow: [
            "0 0 5px #ff0055, 0 0 10px #ff0055, 0 0 20px #ff0055",
            "0 0 10px #00f7ff, 0 0 20px #00f7ff, 0 0 30px #00f7ff",
            "0 0 5px #ff0055, 0 0 15px #ff0055, 0 0 25px #ff0055",
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
      >
        <span className="text-primary">Digital Blacksmith</span>{" "}
        <span className="text-secondary">@CodeStreet254</span>
      </motion.h2>
    </footer>
  );
};

export default Footer;
