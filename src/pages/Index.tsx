import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { MainApp } from "@/components/MainApp";

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);

  const handleEnter = (name: string) => {
    setUserName(name);
  };

  const handleLogout = () => {
    setUserName(null);
  };

  if (!userName) {
    return <WelcomeScreen onEnter={handleEnter} />;
  }

  return <MainApp userName={userName} onLogout={handleLogout} />;
};

export default Index;
