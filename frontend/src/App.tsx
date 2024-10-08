import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Home, Test } from "@/pages";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

function App() {
  return (
    <Router>
      <AdminPanelLayout>
        <main className="min-h-screen flex flex-col items-center">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
          </Routes>
          <Toaster />
        </main>
      </AdminPanelLayout>
    </Router>
  );
}

export default App;
