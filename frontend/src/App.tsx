import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Etherspot, Home, Wagmi } from "@/pages";

function App() {
    return (
        <Router>
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/aa" element={<Etherspot />} />
                    <Route path="/wagmi" element={<Wagmi />} />
                </Routes>
                <Toaster />
            </main>
        </Router>
    );
}

export default App;
