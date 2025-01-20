import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface QuestionCardProps {
  question: {
    question: string;
    options: string[];
    correct: number;
  };
  showOptions: boolean;
  onShowOptions: () => void;
  teams: Array<{ name: string; color: string }>;
  onTeamAnswer: (teamIndex: number) => void;
}

export const QuestionCard = ({ 
  question, 
  showOptions, 
  onShowOptions, 
  teams, 
  onTeamAnswer 
}: QuestionCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="flex flex-col items-center"
  >
    <Card className="w-full max-w-4xl p-8 card-gradient">
      <h2 className="text-4xl mb-8 text-center flex items-center justify-center gap-4">
        <Star className="text-primary" />
        {question.question}
        <Star className="text-primary" />
      </h2>
      
      {!showOptions ? (
        <div className="flex gap-4 justify-center">
          <Button
            variant="ghost"
            onClick={onShowOptions}
            className="text-xl hover:bg-accent/20"
          >
            <HelpCircle className="mr-2 h-6 w-6 text-primary animate-pulse" />
            Show Hints
          </Button>
          {teams.map((team, index) => (
            <Button
              key={index}
              onClick={() => onTeamAnswer(index)}
              className="text-xl"
              style={{ 
                backgroundColor: team.color,
                color: 'white'
              }}
            >
              {team.name} Answered
            </Button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              size="lg"
              variant="outline"
              className="text-2xl p-6"
              onClick={() => {
                if (index === question.correct) {
                  toast.success("Correct Answer!");
                } else {
                  toast.error("Wrong Answer!");
                }
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </Card>
  </motion.div>
);