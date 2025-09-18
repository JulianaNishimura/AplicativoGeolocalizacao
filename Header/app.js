// src/App.js

import React from 'react';
import Header from './components/Header'; // Importa o seu componente Header
import './App.css'; // Se houver um CSS global

function App() {
  return (
    <div className="App">
      <Header />
      {/* O resto do seu aplicativo vai aqui */}
    </div>
  );
}

export default App;