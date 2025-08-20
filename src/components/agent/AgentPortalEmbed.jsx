// src/components/agent/AgentPortalEmbed.jsx
// This component goes in your MAIN application to embed the agent portal

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

const AgentPortalEmbed = () => {
  const { user } = useAuth();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  // Replace with your actual agent portal URL after deployment
  const AGENT_PORTAL_URL = process.env.REACT_APP_AGENT_PORTAL_URL || 'http://localhost:3001';

  useEffect(() => {
    // Handle messages from the iframe
    const handleMessage = (event) => {
      // Verify the origin matches your agent portal
      if (event.origin !== AGENT_PORTAL_URL) return;

      const { type, data } = event.data;

      switch (type) {
        case 'AGENT_PORTAL_LOADED':
          console.log('Agent portal loaded');
          setLoading(false);
          // Send initialization data to agent portal
          if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage({
              type: 'INIT_AGENT_PORTAL',
              user: {
                name: user?.name,
                email: user?.email,
                role: user?.role,
                company: user?.company
              },
              timestamp: new Date().toISOString()
            }, AGENT_PORTAL_URL);
          }
          break;

        case 'AGENT_PORTAL_READY':
          console.log('Agent portal ready');
          setPortalReady(true);
          break;

        case 'QUOTE_TYPE_SELECTED':
          console.log('Quote type selected:', data?.quoteType);
          // You can track analytics or perform other actions here
          break;

        case 'QUOTE_SUBMITTED':
          console.log('Quote submitted:', data);
          // Handle quote submission if needed
          // Could trigger notifications, update main app state, etc.
          break;

        case 'RESIZE_IFRAME':
          // Handle dynamic resizing if needed
          if (data?.height && iframeRef.current) {
            iframeRef.current.style.height = `${data.height}px`;
          }
          break;

        default:
          console.log('Unknown message from agent portal:', type);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, AGENT_PORTAL_URL]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    window.open(AGENT_PORTAL_URL, '_blank');
  };

  return (
    <div className={`agent-portal-embed ${isFullscreen ? 'fullscreen' : ''}`}>
      <style>{`
        .agent-portal-embed {
          position: relative;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .agent-portal-embed.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          border-radius: 0;
        }

        .portal-header {
          display: flex;
          align-items: center;
          justify-content: between;
          padding: 12px 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .portal-title {
          flex: 1;
          font-weight: 600;
          color: #333;
        }

        .portal-actions {
          display: flex;
          gap: 8px;
        }

        .portal-action-btn {
          padding: 6px 10px;
          background: transparent;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          color: #495057;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .portal-action-btn:hover {
          background: white;
          border-color: #adb5bd;
        }

        .portal-iframe-container {
          position: relative;
          width: 100%;
          height: ${isFullscreen ? '100vh' : '800px'};
          overflow: hidden;
        }

        .portal-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .portal-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .portal-loading-spinner {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .portal-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: ${portalReady ? '#d4edda' : '#fff3cd'};
          color: ${portalReady ? '#155724' : '#856404'};
          border-radius: 12px;
          font-size: 12px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${portalReady ? '#28a745' : '#ffc107'};
          animation: ${portalReady ? 'pulse 2s infinite' : 'none'};
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="portal-header">
        <div className="portal-title">Agent Quote Portal</div>
        <div className="portal-status">
          <span className="status-dot"></span>
          {portalReady ? 'Connected' : 'Connecting...'}
        </div>
        <div className="portal-actions">
          <button 
            className="portal-action-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 size={16} />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 size={16} />
                Fullscreen
              </>
            )}
          </button>
          <button 
            className="portal-action-btn"
            onClick={openInNewTab}
            title="Open in new tab"
          >
            <ExternalLink size={16} />
            New Tab
          </button>
        </div>
      </div>

      <div className="portal-iframe-container">
        {loading && (
          <div className="portal-loading">
            <Loader2 className="portal-loading-spinner" />
            <div>Loading Agent Portal...</div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={AGENT_PORTAL_URL}
          className="portal-iframe"
          title="Agent Quote Portal"
          allow="clipboard-read; clipboard-write"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default AgentPortalEmbed;

// Usage in your main app:
// 1. Add this component to your routes in App.js:
//    <Route path="/agent-portal" element={<AgentPortalEmbed />} />
//
// 2. Add navigation link in your sidebar/menu:
//    <Link to="/agent-portal">Agent Portal</Link>
//
// 3. Set environment variable:
//    REACT_APP_AGENT_PORTAL_URL=https://agent-portal.yourdomain.com
