import { motion } from 'framer-motion';
import { Target, Map } from 'lucide-react';

export default function GoalsPage() {
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Target size={20} className="text-accent-400" />
        <h1 className="text-xl font-bold text-white">Career GPS</h1>
      </div>

      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <Map size={32} className="text-gray-600 mb-3" />
        <p className="text-gray-400 text-sm">Career GPS — Phase 1.5+</p>
        <p className="text-gray-600 text-xs mt-1 font-mono">Goal → Roadmap → Daily Actions</p>
        <p className="text-gray-600 text-xs mt-1">Coming after Deadline Guardian is wired up.</p>
      </div>
    </motion.div>
  );
}
