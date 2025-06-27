import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateEntry from './pages/CreateEntry';
import ViewEntries from './pages/ViewEntries';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<ProtectedRoute><CreateEntry /></ProtectedRoute>} />
        <Route path="/view" element={<ProtectedRoute><ViewEntries /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
