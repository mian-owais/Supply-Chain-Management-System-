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
      <h1>Supply Chain Dashboard</h1>
      <p>Track products through the supply chain</p>

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
            <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                <div className="product-name">{product.name}</div>
                <div className="product-id">ID: {product.id}</div>
                <div className={`product-state ${getStateClass(product.state)}`}>
                  {product.state}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
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
