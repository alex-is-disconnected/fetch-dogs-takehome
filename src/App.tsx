import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Match from "./pages/Match";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/match" 
          element={
            <ProtectedRoute>
              <Match />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="app">
            <AppRoutes />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
