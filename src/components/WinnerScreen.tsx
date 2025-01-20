import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const WinnerScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teams, scores } = location.state;

  const winnerIndex = scores.indexOf(Math.max(...scores));

  return (
    <div className="game-container flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="title-text">Congratulations!</h1>
        <h2 className="text-4xl text-primary mb-8">{teams[winnerIndex].name}</h2>
        <p className="subtitle-text">Winner with {scores[winnerIndex]} points!</p>
        <Button
          size="lg"
          className="text-2xl px-8 py-6 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/")}
        >
          Play Again
        </Button>
      </motion.div>
    </div>
  );
};