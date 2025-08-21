// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components (we'll create these next)
import QuoteSelection from './components/QuoteSelection';
import AirQuoteForm from './components/quotes/AirQuoteForm';
import OceanQuoteForm from './components/quotes/OceanQuoteForm';
import ProjectQuoteForm from './components/quotes/ProjectQuoteForm';
import QuoteResults from './components/quotes/QuoteResults';

function App() {

  useEffect(() => {
    // Listen for messages from parent window (your main app)
    const handleMessage = (event) => {
      // Verify origin if needed
      //if (event.data.type === 'INIT_AGENT_PORTAL') {
       // setParentOrigin(event.origin);
        
        // Send acknowledgment back to parent
        event.source.postMessage({
          type: 'AGENT_PORTAL_READY',
          timestamp: new Date().toISOString()
        }, event.origin);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Notify parent that iframe is loaded
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'AGENT_PORTAL_LOADED',
        timestamp: new Date().toISOString()
      }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900">Agent Quote Portal</h1>
              <div className="text-sm text-gray-500">
                Freight Rate Calculator
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<QuoteSelection />} />
            <Route path="/quote/air" element={<AirQuoteForm />} />
            <Route path="/quote/ocean" element={<OceanQuoteForm />} />
            <Route path="/quote/project" element={<ProjectQuoteForm />} />
            <Route path="/results" element={<QuoteResults />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
