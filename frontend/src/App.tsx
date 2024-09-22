import { Outlet, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import LoginPage from "./pages/Auth/Login";
import Particles from "./components/magicui/particles";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/Auth/Register";
import GamePage from "./pages/Game/GamePage";
import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="relative">
    <Navbar />
    <Particles
      className="fixed inset-0 pointer-events-none"
      quantity={80}
      ease={80}
      color="#ffffff"
      refresh
    />
    <div className="relative z-10">{children || <Outlet />}</div>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
};

export default App;
