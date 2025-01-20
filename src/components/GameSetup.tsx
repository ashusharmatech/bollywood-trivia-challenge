import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const TEAM_COLORS = [
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
  "#E5DEFF", // Soft Purple
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD"  // Soft Blue
];

export const GameSetup = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([
    { name: "", color: TEAM_COLORS[0] },
    { name: "", color: TEAM_COLORS[1] }
  ]);

  const addTeam = () => {
    if (teams.length >= 8) {
      toast.error("Maximum 8 teams allowed");
      return;
    }
    const availableColors = TEAM_COLORS.filter(
      color => !teams.some(team => team.color === color)
    );
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setTeams([...teams, { name: "", color: randomColor }]);
  };

  const removeTeam = () => {
    if (teams.length > 2) {
      setTeams(teams.slice(0, -1));
    }
  };

  const handleStartGame = () => {
    if (teams.every(team => team.name.trim())) {
      navigate("/play", { state: { teams } });
    } else {
      toast.error("Please enter names for all teams");
    }
  };

  return (
    <div className="game-container flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <h1 className="title-text text-center mb-8">Team Setup</h1>
        <Card className="p-8 card-gradient">
          {teams.map((team, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
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
                <div 
                  className="w-8 h-8 rounded-full mt-8"
                  style={{ backgroundColor: team.color }}
                />
              </div>
            </div>
          ))}
          
          <div className="flex gap-4 mt-6 mb-8">
            <Button 
              type="button"
              variant="outline"
              onClick={addTeam}
              className="flex-1"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Team
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={removeTeam}
              className="flex-1"
              disabled={teams.length <= 2}
            >
              <Minus className="mr-2 h-4 w-4" /> Remove Team
            </Button>
          </div>

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