import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { HelpCircle, Star, PartyPopper, Trophy } from "lucide-react";
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
  const [celebratingTeam, setCelebratingTeam] = useState<number | null>(null);

  const handleTeamAnswer = (teamIndex: number) => {
    if (showOptions) {
      toast.error("Cannot select team after showing options!");
      return;
    }
    
    const newScores = [...scores];
    newScores[teamIndex] += 10;
    setScores(newScores);
    setCelebratingTeam(teamIndex);
    
    // Show celebration for 2 seconds
    setTimeout(() => {
      setCelebratingTeam(null);
      setShowScoreDialog(true);
    }, 2000);
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
          <motion.div 
            key={index}
            className="text-2xl flex items-center gap-2 p-4 rounded-lg shadow-lg"
            style={{ 
              backgroundColor: `${team.color}20`,
              border: `2px solid ${team.color}`
            }}
            animate={{
              scale: celebratingTeam === index ? [1, 1.1, 1] : 1,
              rotate: celebratingTeam === index ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.5, repeat: celebratingTeam === index ? 3 : 0 }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: team.color }}
            />
            <span style={{ color: team.color }}>{team.name}</span>
            <div className="flex items-center gap-1">
              <Trophy size={20} className="text-primary" />
              <span className="font-bold">{scores[index]}</span>
            </div>
          </motion.div>
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
          <h2 className="text-4xl mb-8 text-center flex items-center justify-center gap-4">
            <Star className="text-primary" />
            {QUESTIONS[currentQuestion].question}
            <Star className="text-primary" />
          </h2>
          
          {!showOptions ? (
            <div className="flex gap-4 justify-center">
              <Button
                variant="ghost"
                onClick={() => setShowOptions(true)}
                className="text-xl hover:bg-accent/20"
              >
                <HelpCircle className="mr-2 h-6 w-6 text-primary animate-pulse" />
                Show Hints
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
          <Button onClick={handleNextQuestion} className="w-full text-xl">
            Next Question
          </Button>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {celebratingTeam !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="text-8xl">🎉</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};