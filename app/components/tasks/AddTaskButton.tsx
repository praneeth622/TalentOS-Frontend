"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddTaskButtonProps {
  onClick: () => void;
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <Plus size={15} strokeWidth={2.5} />
      Add Task
    </motion.button>
  );
}
