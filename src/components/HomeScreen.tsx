import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="game-container flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="title-text">Bollywood Trivia</h1>
        <p className="subtitle-text">The Ultimate Movie Quiz Game</p>
        <Button 
          size="lg"
          className="text-2xl px-8 py-6 bg-primary hover:bg-primary/90"
          onClick={() => navigate("/setup")}
        >
          Start Game
        </Button>
      </motion.div>
    </div>
  );
};