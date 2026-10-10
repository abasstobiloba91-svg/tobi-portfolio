import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './Portfolio';
import AdminDashboard from './Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element="{<Portfolio" path="/"/>} />
        <Route element="{<AdminDashboard" path="/admin"/>} />
      </Routes>
    </BrowserRouter>
  );
}
