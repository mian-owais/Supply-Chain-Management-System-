import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ web3, account, contract }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [contract]);

  const fetchProducts = async () => {
    try {
      if (!contract) return;
      
      setLoading(true);
      const productList = await contract.methods.getAllProducts().call();
      const stateMap = { 0: 'Created', 1: 'In Transit', 2: 'Delivered', 3: 'Sold' };

      const formattedProducts = productList.map(p => ({
        id: p.productId,
        name: p.name,
        manufacturer: p.manufacturer,
        currentOwner: p.currentOwner,
        state: stateMap[p.currentState],
        stateValue: Number(p.currentState),
        createdAt: new Date(Number(p.createdAt) * 1000).toLocaleDateString()
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStateClass = (state) => {
    const classMap = {
      'Created': 'state-created',
      'In Transit': 'state-intransit',
      'Delivered': 'state-delivered',
      'Sold': 'state-sold'
    };
    return classMap[state] || '';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Supply Chain Control Tower</h1>
        <p className="page-subtitle">Track each asset as it moves from origin to customer.</p>
      </div>

      <div className="dashboard-meta">
        <div className="meta-tile">
          <div className="meta-label">Total Products</div>
          <div className="meta-value">{products.length}</div>
        </div>
        <div className="meta-tile">
          <div className="meta-label">Created</div>
          <div className="meta-value">{products.filter((p) => p.stateValue === 0).length}</div>
        </div>
        <div className="meta-tile">
          <div className="meta-label">In Transit</div>
          <div className="meta-value">{products.filter((p) => p.stateValue === 1).length}</div>
        </div>
        <div className="meta-tile">
          <div className="meta-label">Completed</div>
          <div className="meta-value">{products.filter((p) => p.stateValue === 3).length}</div>
        </div>
      </div>

      {!account ? (
        <div className="card">
          <p>Please connect your wallet to view products.</p>
        </div>
      ) : loading ? (
        <div className="card">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="card">
          <p>No products found. <Link to="/create-product">Create one</Link></p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="card-link">
              <div className="product-card">
                <div className="product-name">{product.name}</div>
                <div className="product-id">ID: {product.id}</div>
                <div className={`product-state ${getStateClass(product.state)}`}>
                  {product.state}
                </div>
                <div className="product-date">
                  Created: {product.createdAt}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
