import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { TeamScore } from "./game/TeamScore";
import { QuestionCard } from "./game/QuestionCard";
import { ScoreDialog } from "./game/ScoreDialog";

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
          <TeamScore
            key={index}
            team={team}
            score={scores[index]}
            isCelebrating={celebratingTeam === index}
          />
        ))}
      </div>
      
      <QuestionCard
        question={QUESTIONS[currentQuestion]}
        showOptions={showOptions}
        onShowOptions={() => setShowOptions(true)}
        teams={teams}
        onTeamAnswer={handleTeamAnswer}
      />

      <ScoreDialog
        open={showScoreDialog}
        onOpenChange={setShowScoreDialog}
        teams={teams}
        scores={scores}
        onNextQuestion={handleNextQuestion}
      />

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