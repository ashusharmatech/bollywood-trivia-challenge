import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { PartyPopper, Trophy } from "lucide-react";

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Array<{ name: string; color: string }>;
  scores: number[];
  onNextQuestion: () => void;
}

export const ScoreDialog = ({ 
  open, 
  onOpenChange, 
  teams, 
  scores, 
  onNextQuestion 
}: ScoreDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
          <PartyPopper className="text-primary" />
          Current Scores
          <PartyPopper className="text-primary" />
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {teams.map((team, index) => (
          <motion.div 
            key={index}
            className="flex justify-between items-center text-xl p-4 rounded-lg"
            style={{ 
              backgroundColor: `${team.color}20`,
              border: `2px solid ${team.color}`,
              color: team.color
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="flex items-center gap-2">
              <Trophy size={20} />
              {team.name}
            </span>
            <span className="font-bold">{scores[index]} points</span>
          </motion.div>
        ))}
      </div>
      <Button onClick={onNextQuestion} className="w-full text-xl">
        Next Question
      </Button>
    </DialogContent>
  </Dialog>
);