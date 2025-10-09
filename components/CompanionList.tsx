"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, getSubjectColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface CompanionsListProps {
  title: string;
  companions?: any[];
  classNames?: string;
}

const CompanionsList = ({ title, companions, classNames }: CompanionsListProps) => {
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  // Remove duplicates based on ID to prevent key conflicts
  const uniqueCompanions = companions?.filter((companion, index, self) => 
    index === self.findIndex((c) => c.id === companion.id)
  ) || [];

  // If we still have duplicates (shouldn't happen), create unique keys
  const getUniqueKey = (companion: any, index: number) => {
    return `${companion.id}-${index}`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn('companion-list group', classNames)}
    >
      <motion.h2 
        className="font-bold text-xl sm:text-2xl lg:text-3xl mb-6"
        whileHover={{ scale: 1.01 }}
      >
        {title}
      </motion.h2>

      <div className="table-container">
        <Table className="responsive-table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="table-header-cell w-[50%]">Lesson</TableHead>
              <TableHead className="table-header-cell w-[20%]">Subject</TableHead>
              <TableHead className="table-header-cell w-[30%] text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueCompanions.map((companion, index) => {
              const { id, subject, name, topic, duration } = companion;
              
              return (
                <motion.tr
                  key={getUniqueKey(companion, index)}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  whileHover={{ 
                    backgroundColor: "rgba(255, 107, 53, 0.03)",
                    transition: { duration: 0.2 }
                  }}
                  className="group cursor-pointer"
                >
                  <TableCell className="table-cell">
                    <Link href={`/companions/${id}`}>
                      <motion.div 
                        className="companion-info-mobile"
                        whileHover={{ x: 3 }}
                      >
                        <motion.div 
                          className="size-10 lg:size-12 flex items-center justify-center rounded-lg"
                          style={{ backgroundColor: getSubjectColor(subject) }}
                          whileHover={{ scale: 1.05, rotate: 2 }}
                        >
                          <Image
                            src={`/icons/${subject}.png`}
                            alt={subject}
                            width={20}
                            height={20}
                            className="lg:w-6 lg:h-6 filter brightness-0 invert"
                          />
                        </motion.div>
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <motion.p 
                            className="font-bold text-sm lg:text-base group-hover:text-primary transition-colors duration-300 truncate"
                            whileHover={{ x: 2 }}
                            title={name}
                          >
                            {name}
                          </motion.p>
                          <p 
                            className="topic-text" 
                            title={topic}
                          >
                            {topic}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  </TableCell>
                  <TableCell className="table-cell">
                    <motion.div 
                      className="subject-badge w-fit text-xs lg:text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {subject}
                    </motion.div>
                  </TableCell>
                  <TableCell className="table-cell">
                    <motion.div 
                      className="flex items-center gap-2 w-full justify-end"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm lg:text-base font-medium">
                        {duration} 
                        <span className="hidden sm:inline"> mins</span>
                      </p>
                    </motion.div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Show message if duplicates were removed */}
      {uniqueCompanions.length !== companions?.length && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {uniqueCompanions.length} of {companions?.length} items (duplicates removed)
        </div>
      )}
    </motion.article>
  );
}

export default CompanionsList;