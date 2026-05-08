import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PhishingSites from './pages/PhishingSites';
import ModelAnalysis from './pages/ModelAnalysis';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sites" element={<PhishingSites />} />
          <Route path="/analysis" element={<ModelAnalysis />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
