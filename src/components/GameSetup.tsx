import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const GameSetup = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([
    { name: "", color: "#FFD700" },
    { name: "", color: "#DC2626" }
  ]);

  const handleStartGame = () => {
    if (teams.every(team => team.name.trim())) {
      navigate("/play", { state: { teams } });
    }
  };

  return (
    <div className="game-container flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <h1 className="title-text text-center">Team Setup</h1>
        <Card className="p-8 card-gradient">
          {teams.map((team, index) => (
            <div key={index} className="mb-6">
              <Label className="text-xl mb-2">Team {index + 1} Name</Label>
              <Input
                className="text-xl p-6 mb-4"
                value={team.name}
                onChange={(e) => {
                  const newTeams = [...teams];
                  newTeams[index].name = e.target.value;
                  setTeams(newTeams);
                }}
                placeholder={`Enter Team ${index + 1} name`}
              />
            </div>
          ))}
          <Button 
            size="lg"
            className="w-full text-2xl mt-4 bg-primary hover:bg-primary/90"
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};