import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      backgroundColor: '#004080',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/20/Amphenol_Logo.svg"
          alt="Amphenol Logo"
          style={{ height: 50, objectFit: 'contain' }}
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/en/1/12/DesignLink_logo.svg"
          alt="DesignLink Logo"
          style={{ height: 50, objectFit: 'contain' }}
        />
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ marginRight: 20 }}>Welcome Akhil Anil</span>
        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          Log Out
        </a>
      </div>
    </header>
  );
};

export default Header;
