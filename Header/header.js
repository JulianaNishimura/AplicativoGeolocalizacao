import React from 'react';
import './Header.css'; // Importa o arquivo CSS
import lupa from '../assets/lupa.png'; // Importa a imagem da lupa

const Header = () => {
  return (
    <header>
      <form>
        {/* Usamos o atributo "alt" para acessibilidade */}
        <img src={lupa} alt="Ícone de pesquisa" className="search-icon" />
        <input type="text" placeholder="Pesquisar..." />
      </form>
    </header>
  );
};

export default Header;