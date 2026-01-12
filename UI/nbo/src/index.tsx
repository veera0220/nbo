import React from 'react';
import ReactDOM from 'react-dom/client';
import "primereact/resources/themes/lara-light-cyan/theme.css"; // or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";

import Footer from './components/Footer';
import Header from './components/Header';
import Navbar from './components/Navbar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Navbar />
      <main className="!overscroll-scroll max-h-[80vh]" style={{ minHeight: '80vh', padding: '15px', overflow: 'scroll' }}>
          <App />
      </main>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
