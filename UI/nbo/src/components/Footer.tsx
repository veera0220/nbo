// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (


<footer className='flex items-center justify-center gap-1' style={{
      backgroundColor: '#004080',
      color: 'white',
      textAlign: 'center',
      padding: '15px 0',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      fontSize: '14px',
    }}>
  <p className="mb-1 font-medium">
    All Documents are Amphenol Confidential
  </p>
  <p className="mb-1">
    <a href="#" className="hover:underline">
      Site Terms Of Use
    </a>{" "}
    |{" "}
    <a href="#" className="hover:underline">
      Privacy Policy
    </a>
  </p>
  <p className="mb-1">
    © Amphenol Corporation {new Date().getFullYear()}. All rights reserved.
  </p>
</footer>

  );
};

export default Footer;
