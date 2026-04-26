import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ account, userRole, connectWallet }) {
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header>
      <nav>
        <div className="logo">🔗 Supply Chain</div>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/create-product">Create Product</Link></li>
          <li><Link to="/manage-roles">Manage Roles</Link></li>
        </ul>
        <div className="wallet-info">
          {account ? (
            <>
              <span className="badge">Role: {userRole}</span>
              <span>{truncateAddress(account)}</span>
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
