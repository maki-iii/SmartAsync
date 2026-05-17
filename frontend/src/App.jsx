import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/Landing_page";
import HomeEmulator from "./pages/home_emulator/HomeEmulator";
import TestCommandVoice from "./pages/TestCommandVoice"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomeEmulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;