import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PreSession from './pages/PreSession';
import PostSession from './pages/PostSession';
import ProgressTracker from './pages/ProgressTracker';
import ImageAnalysis from './pages/ImageAnalysis';
import Analysis from './pages/Analysis';
import AnalysisCreate from './pages/AnalysisCreate';
import AnalysisView from './pages/AnalysisView';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';
import Training from './pages/Training';
import SessionHistory from './pages/history';
import AuthGuard from './components/auth/AuthGuard';
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/" element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }>
          <Route index element={<Dashboard />} />
          <Route path="pre-session" element={<PreSession />} />
          <Route path="post-session" element={<PostSession />} />
          <Route path="progress" element={<ProgressTracker />} />
          <Route path="image-analysis" element={<ImageAnalysis />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="analysis/create" element={<AnalysisCreate />} />
          <Route path="analysis/:id" element={<AnalysisView />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="settings" element={<Settings />} />
          <Route path="training" element={<Training />} />
          <Route path="history" element={<SessionHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;