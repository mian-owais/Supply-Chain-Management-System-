import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ account, userRole, connectWallet }) {
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header>
      <nav>
        <div className="logo">
          <div className="logo-mark">Supply Chain</div>
          <div className="logo-caption">Decentralized Management System</div>
        </div>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Dashboard</NavLink></li>
          <li><NavLink to="/create-product" className={({ isActive }) => (isActive ? 'active-link' : '')}>Create Product</NavLink></li>
          <li><NavLink to="/manage-roles" className={({ isActive }) => (isActive ? 'active-link' : '')}>Manage Roles</NavLink></li>
        </ul>
        <div className="wallet-info">
          {account ? (
            <>
              <span className="badge">Role: {userRole}</span>
              <span className="wallet-address">{truncateAddress(account)}</span>
            </>
          ) : (
            <button className="btn-connect" onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
