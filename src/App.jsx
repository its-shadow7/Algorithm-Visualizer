import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Library from './pages/Library';
import Visualizer from './pages/Visualizer';
import Benchmark from './pages/Benchmark';
import Pathfinding from './pages/Pathfinding';
import TreeVisualizer from './pages/TreeVisualizer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* All routes wrapped in the Layout shell */}
          <Route path="/" element={<Layout />}>
            {/* Default redirect to library */}
            <Route index element={<Navigate to="/library" replace />} />
            
            <Route path="library" element={<Library />} />
            
            {/* Hierarchical Sorting Routes */}
            <Route path="sorting">
              <Route index element={<Navigate to="/library" replace />} />
              <Route path="race" element={<Benchmark />} />
              <Route path=":slug" element={<Visualizer />} />
            </Route>

            {/* Hierarchical Pathfinding Routes */}
            <Route path="pathfinding">
              <Route index element={<Navigate to="/pathfinding/bfs" replace />} />
              <Route path=":algo" element={<Pathfinding />} />
            </Route>

            {/* Tree Structure Routes */}
            <Route path="trees">
              <Route index element={<Navigate to="/trees/bst" replace />} />
              <Route path="bst" element={<TreeVisualizer />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/library" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
