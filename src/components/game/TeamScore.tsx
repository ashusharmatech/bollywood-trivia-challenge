import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface TeamScoreProps {
  team: {
    name: string;
    color: string;
  };
  score: number;
  isCelebrating: boolean;
}

export const TeamScore = ({ team, score, isCelebrating }: TeamScoreProps) => (
  <motion.div 
    key={team.name}
    className="text-2xl flex items-center gap-2 p-4 rounded-lg shadow-lg"
    style={{ 
      backgroundColor: `${team.color}20`,
      border: `2px solid ${team.color}`
    }}
    animate={{
      scale: isCelebrating ? [1, 1.1, 1] : 1,
      rotate: isCelebrating ? [0, 5, -5, 0] : 0
    }}
    transition={{ duration: 0.5, repeat: isCelebrating ? 3 : 0 }}
  >
    <div 
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: team.color }}
    />
    <span style={{ color: team.color }}>{team.name}</span>
    <div className="flex items-center gap-1">
      <Trophy size={20} className="text-primary" />
      <span className="font-bold">{score}</span>
    </div>
  </motion.div>
);