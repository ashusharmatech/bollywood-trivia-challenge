import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./components/HomeScreen";
import { GameSetup } from "./components/GameSetup";
import { GamePlay } from "./components/GamePlay";
import { WinnerScreen } from "./components/WinnerScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/play" element={<GamePlay />} />
          <Route path="/winner" element={<WinnerScreen />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;