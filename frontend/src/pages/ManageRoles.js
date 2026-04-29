import React, { useState } from 'react';

function ManageRoles({ account, contract, userRole }) {
  const [targetAddress, setTargetAddress] = useState('');
  const [role, setRole] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      setError('Please connect wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await contract.methods.assignRole(targetAddress, role).send({ from: account });
      setTargetAddress('');
      setRole('1');
      alert('Role assigned successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Governance and Role Assignment</h1>
        <p className="page-subtitle">Grant Manufacturer, Distributor, and Retailer access to participant wallets.</p>
      </div>
      
      <div className="card form-wrap">
        <p className="helper-text">Only the Admin account can assign stakeholder roles.</p>

        {account && userRole !== 'Admin' && (
          <div className="alert alert-info">Current role is {userRole}. Switch to the Admin wallet to assign roles.</div>
        )}
        
        <form onSubmit={handleAssignRole}>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              required
              placeholder="0x..."
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="1">Manufacturer</option>
              <option value="2">Distributor</option>
              <option value="3">Retailer</option>
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading || userRole !== 'Admin'}>
            {loading ? 'Assigning...' : 'Assign Role'}
          </button>
        </form>
      </div>

      <div className="card roles-info">
        <h3>Role Information</h3>
        <p><strong>Manufacturer:</strong> Creates and registers products</p>
        <p><strong>Distributor:</strong> Ships products and initiates transit</p>
        <p><strong>Retailer:</strong> Receives and sells products to customers</p>
      </div>
    </div>
  );
}

export default ManageRoles;
