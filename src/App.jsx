import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Editor from './pages/Editor';
import Splash from './components/Splash';
import TermsModal from './components/TermsModal';

function App() {
  const [loading, setLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('termsAccepted');
    if (accepted === 'true') {
      setTermsAccepted(true);
    }
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    setTermsAccepted(true);
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <Router>
      {!termsAccepted && <TermsModal onAccept={handleAcceptTerms} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={termsAccepted ? <Editor /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
