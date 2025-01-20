import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const QUESTIONS = [
  {
    question: "Which was the first Indian movie nominated for Oscar?",
    options: ["Mother India", "Lagaan", "Salaam Bombay", "The Guide"],
    correct: 0
  },
  {
    question: "Who is known as the 'King of Bollywood'?",
    options: ["Amitabh Bachchan", "Shah Rukh Khan", "Salman Khan", "Aamir Khan"],
    correct: 1
  },
  {
    question: "Which was the first Indian color film?",
    options: ["Aan", "Kisan Kanya", "Mother India", "Awara"],
    correct: 0
  }
];

export const GamePlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!location.state?.teams) {
      toast.error("Please set up teams before starting the game");
      navigate("/setup");
      return;
    }
  }, [location.state, navigate]);

  if (!location.state?.teams) {
    return null;
  }

  const { teams } = location.state;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(teams.map(() => 0));
  const [showOptions, setShowOptions] = useState(false);
  const [showScoreDialog, setShowScoreDialog] = useState(false);

  const handleTeamAnswer = (teamIndex: number) => {
    const newScores = [...scores];
    newScores[teamIndex] += 10;
    setScores(newScores);
    setShowScoreDialog(true);
  };

  const handleNextQuestion = () => {
    setShowScoreDialog(false);
    setShowOptions(false);
    if (currentQuestion === QUESTIONS.length - 1) {
      navigate("/winner", { state: { teams, scores } });
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  return (
    <div className="game-container">
      <div className="flex justify-between mb-8">
        {teams.map((team, index) => (
          <div 
            key={index}
            className="text-2xl flex items-center gap-2"
            style={{ color: team.color }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: team.color }}
            />
            {team.name}: {scores[index]}
          </div>
        ))}
      </div>
      
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col items-center"
      >
        <Card className="w-full max-w-4xl p-8 card-gradient">
          <h2 className="text-4xl mb-8 text-center">{QUESTIONS[currentQuestion].question}</h2>
          
          {!showOptions ? (
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setShowOptions(true)}
                className="text-xl"
              >
                Show Options
              </Button>
              {teams.map((team, index) => (
                <Button
                  key={index}
                  onClick={() => handleTeamAnswer(index)}
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
              {QUESTIONS[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  size="lg"
                  variant="outline"
                  className="text-2xl p-6"
                  onClick={() => {
                    if (index === QUESTIONS[currentQuestion].correct) {
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

      <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Current Scores</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {teams.map((team, index) => (
              <div 
                key={index}
                className="flex justify-between items-center text-xl"
                style={{ color: team.color }}
              >
                <span>{team.name}</span>
                <span>{scores[index]} points</span>
              </div>
            ))}
          </div>
          <Button onClick={handleNextQuestion} className="w-full text-xl">
            Next Question
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};