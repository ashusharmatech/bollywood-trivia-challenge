import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Star, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

interface QuestionCardProps {
  question: {
    question: string;
    hint: string;
    answer: string;
    category: string;
  };
  showHint: boolean;
  onShowHint: () => void;
  teams: Array<{ name: string; color: string }>;
  onTeamAnswer: (teamIndex: number) => void;
  onSkipQuestion: () => void;
}

export const QuestionCard = ({ 
  question, 
  showHint, 
  onShowHint, 
  teams, 
  onTeamAnswer,
  onSkipQuestion
}: QuestionCardProps) => {
  const [answerRevealed, setAnswerRevealed] = useState(false);

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
              onClick={onShowHint}
              className="text-xl hover:bg-accent/20"
              disabled={answerRevealed}
            >
              <HelpCircle className="mr-2 h-6 w-6 text-primary" />
              Show Hint
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
        
        {showHint && (
          <div className="mb-8 p-4 bg-accent/10 rounded-lg">
            <p className="text-xl text-center">{question.hint}</p>
            <Button 
              className="mt-4 w-full text-xl"
              onClick={() => {
                setAnswerRevealed(true);
                toast.success("Answer revealed! Select the team that answered correctly.");
              }}
              disabled={answerRevealed}
            >
              Reveal Answer
            </Button>
            {answerRevealed && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl text-center font-bold text-primary">{question.answer}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <Button
              key={index}
              onClick={() => {
                if (!answerRevealed && !showHint) {
                  toast.error("Please show hint and reveal the answer first!");
                  return;
                }
                onTeamAnswer(index);
                setAnswerRevealed(false);
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
      </Card>
    </motion.div>
  );
};