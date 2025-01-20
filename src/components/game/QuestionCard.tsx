import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Star, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

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
  onSkipQuestion: () => void;
}

export const QuestionCard = ({ 
  question, 
  showOptions, 
  onShowOptions, 
  teams, 
  onTeamAnswer,
  onSkipQuestion
}: QuestionCardProps) => {
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center gap-4"
    >
      <Card className="w-full max-w-4xl p-8 card-gradient">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl text-center flex items-center justify-center gap-4 flex-1">
            <Star className="text-primary" />
            {question.question}
            <Star className="text-primary" />
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onShowOptions}
              className="text-xl hover:bg-accent/20"
              disabled={correctAnswerShown}
            >
              <HelpCircle className="mr-2 h-6 w-6 text-primary" />
              Show Hints
            </Button>
            <Button
              variant="outline"
              onClick={onSkipQuestion}
              className="text-xl hover:bg-accent/20"
            >
              <SkipForward className="mr-2 h-6 w-6 text-primary" />
              Skip
            </Button>
          </div>
        </div>
        
        {showOptions ? (
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                size="lg"
                variant="outline"
                className="text-2xl p-6"
                onClick={() => {
                  if (index === question.correct) {
                    toast.success("Correct Answer! Select the team that answered.");
                    setCorrectAnswerShown(true);
                    onShowOptions(); // Hide options
                  } else {
                    toast.error("Wrong Answer! Try again.");
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {teams.map((team, index) => (
              <Button
                key={index}
                onClick={() => {
                  if (!correctAnswerShown && !showOptions) {
                    toast.error("Please show hints and select the correct answer first!");
                    return;
                  }
                  onTeamAnswer(index);
                  setCorrectAnswerShown(false); // Reset for next question
                }}
                className="text-xl py-8"
                style={{ 
                  backgroundColor: team.color,
                  color: 'white'
                }}
              >
                {team.name} Answered
              </Button>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};