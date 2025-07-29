import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { Dashboard } from './components';
import {
  Profile,
  ProductOverview,
  Smartwatch,
  Drone,
  Speaker,
  Chargers,
  Customers,
  Message,
  Settings,
} from './pages';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default route redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* General menu routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Product routes */}
          <Route path="/products" element={<ProductOverview />} />
          <Route path="/products/smartwatch" element={<Smartwatch />} />
          <Route path="/products/drone" element={<Drone />} />
          <Route path="/products/speaker" element={<Speaker />} />
          <Route path="/products/chargers" element={<Chargers />} />
          
          {/* Other routes */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/messages" element={<Message />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
