import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  const { teams } = location.state;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState(teams.map(() => 0));
  const [currentTeam, setCurrentTeam] = useState(0);

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === QUESTIONS[currentQuestion].correct) {
      const newScores = [...scores];
      newScores[currentTeam] += 10;
      setScores(newScores);
    }

    if (currentQuestion === QUESTIONS.length - 1) {
      navigate("/winner", { state: { teams, scores } });
    } else {
      setCurrentQuestion(prev => prev + 1);
      setCurrentTeam((currentTeam + 1) % teams.length);
    }
  };

  return (
    <div className="game-container">
      <div className="flex justify-between mb-8">
        {teams.map((team, index) => (
          <div 
            key={index}
            className={`text-2xl ${currentTeam === index ? "text-primary" : "text-muted-foreground"}`}
          >
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
          <div className="grid grid-cols-2 gap-4">
            {QUESTIONS[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                size="lg"
                variant="outline"
                className="text-2xl p-6"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};