import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import TweetList from "./components/TweetList";
import UserDetail from "./pages/UserDetail";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Page principale contenant les tweets */}
            <Route
              path="/"
              element={
                <>
                  <div className="px-4 mt-5"></div>
                  <h1 className="text-2xl mb-10 px-4">
                    Liste des Publications
                  </h1>
                  <TweetList />
                </>
              }
            />
            <Route path="/user/:username" element={<UserDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
