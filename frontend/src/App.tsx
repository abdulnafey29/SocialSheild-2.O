import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MessageDetectorPage } from './pages/MessageDetectorPage';
import { UrlAnalyzerPage } from './pages/UrlAnalyzerPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { HeaderAnalyzerPage } from './pages/HeaderAnalyzerPage';
import { TrainingPage } from './pages/TrainingPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'messages':
        return <MessageDetectorPage />;
      case 'urls':
        return <UrlAnalyzerPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'headers':
        return <HeaderAnalyzerPage />;
      case 'training':
        return <TrainingPage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActivePage()}
    </Layout>
  );
}

export default App;
