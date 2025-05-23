"use client"

import { useTranslations } from "next-intl";
import ImageIcon from "../components/ImageIcon";

const ComingSoonView = () => {
  const t = useTranslations();
  return (
    <div className="jira-coming-soon">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center py-4">
            {/* Jira-style Logo */}
            <div className="jira-logo mb-4">
              <ImageIcon name="comming-soon" width={100} height={100} />
            </div>
            
            {/* Main Heading */}
            <h2 className="display-4 fw-bold mb-3" style={{color: '#172B4D'}}>{t('coming_soon.page_title')}</h2>
            <p className="lead mb-4" style={{color: '#5E6C84'}}>{t('coming_soon.page_message')}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .jira-coming-soon {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background-color: #F4F5F7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          padding: 2rem 0;
        }
        
        .jira-logo {
          color: #2684FF;
          animation: pulse 2s infinite;
        }
        
        .countdown-box {
          min-width: 90px;
          transition: all 0.3s ease;
        }
        
        .countdown-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        
        .notification-form {
          transition: all 0.3s ease;
        }
        
        .notification-form:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .display-4 {
            font-size: 2.5rem;
          }
          
          .countdown-box {
            min-width: 70px;
            padding: 0.75rem !important;
          }
          
          .countdown-value {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonView;