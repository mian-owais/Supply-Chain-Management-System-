import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProduct({ web3, account, contract }) {
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
      <h1>Create New Product</h1>
      
      <div className="card" style={{ maxWidth: '500px' }}>
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

          {error && <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
