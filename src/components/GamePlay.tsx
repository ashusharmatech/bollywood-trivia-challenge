import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { TeamScore } from "./game/TeamScore";
import { QuestionCard } from "./game/QuestionCard";
import { ScoreDialog } from "./game/ScoreDialog";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLLNYltjgpUfaVY1wVM5rqQb-LPoOXgqUrWMUxTIorLOsKZfMH2e1dHxTT9y3R5Yn7LNpaUqevWgQj/pub?output=csv";

interface Question {
  question: string;
  hint: string;
  answer: string;
  category: string;
}

export const GamePlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!location.state?.teams) {
      toast.error("Please set up teams before starting the game");
      navigate("/setup");
      return;
    }

    // Fetch questions from Google Sheets
    const fetchQuestions = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        // Parse CSV (simple parser, you might want to use a CSV library for production)
        const rows = csvText.split('\n').slice(1); // Skip header row
        const parsedQuestions = rows.map(row => {
          const [question, hint, answer, category] = row.split(',').map(cell => cell.trim());
          return {
            question,
            hint,
            answer,
            category
          };
        });

        // Filter questions based on selected categories if specified
        const filteredQuestions = location.state?.categories?.length > 0
          ? parsedQuestions.filter(q => location.state.categories.includes(q.category))
          : parsedQuestions;

        // Shuffle and limit questions based on questionCount
        const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, location.state?.questionCount || 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error("Failed to load questions. Using fallback questions.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [location.state, navigate]);

  if (!location.state?.teams || loading) {
    return (
      <div className="game-container flex items-center justify-center">
        <div className="text-2xl">Loading questions...</div>
      </div>
    );
  }

  const { teams } = location.state;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(teams.map(() => 0));
  const [showHint, setShowHint] = useState(false);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [celebratingTeam, setCelebratingTeam] = useState<number | null>(null);

  const handleTeamAnswer = (teamIndex: number) => {
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
    setShowHint(false);
    if (currentQuestion === questions.length - 1) {
      navigate("/winner", { state: { teams, scores } });
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSkipQuestion = () => {
    toast.info("Question skipped!");
    handleNextQuestion();
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
        question={questions[currentQuestion]}
        showHint={showHint}
        onShowHint={() => setShowHint(!showHint)}
        teams={teams}
        onTeamAnswer={handleTeamAnswer}
        onSkipQuestion={handleSkipQuestion}
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