import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProduct({ account, contract, userRole }) {
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      setError('Please connect wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const gas = await contract.methods.createProduct(productName).estimateGas({ from: account });
      await contract.methods.createProduct(productName).send({ from: account, gas });
      setProductName('');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Register New Product</h1>
        <p className="page-subtitle">Create an immutable on-chain record for a newly manufactured item.</p>
      </div>
      
      <div className="card form-wrap">
        <p className="helper-text">Only accounts with the Manufacturer role can create products.</p>

        {account && userRole !== 'Manufacturer' && (
          <div className="alert alert-info">Current role is {userRole}. Switch to a Manufacturer wallet to submit this action.</div>
        )}

        <form onSubmit={handleCreateProduct}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              placeholder="Enter product name"
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading || userRole !== 'Manufacturer'}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
