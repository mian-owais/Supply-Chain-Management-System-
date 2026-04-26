import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail({ web3, account, contract }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [contract, id]);

  const fetchProductDetails = async () => {
    try {
      if (!contract) return;
      
      setLoading(true);
      const productData = await contract.methods.getProduct(id).call();
      const historyData = await contract.methods.getHistory(id).call();
      
      const stateMap = { 0: 'Created', 1: 'In Transit', 2: 'Delivered', 3: 'Sold' };
      
      setProduct({
        id: productData.productId,
        name: productData.name,
        manufacturer: productData.manufacturer,
        currentOwner: productData.currentOwner,
        state: stateMap[productData.currentState],
        stateValue: productData.currentState,
        createdAt: new Date(Number(productData.createdAt) * 1000).toLocaleString()
      });

      setHistory(historyData.map(h => ({
        state: stateMap[h.state],
        actor: h.actor,
        timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString(),
        note: h.note
      })));
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipProduct = async () => {
    if (!contract || !account) return;
    
    try {
      setTxLoading(true);
      await contract.methods.shipProduct(id, note).send({ from: account });
      setNote('');
      await fetchProductDetails();
    } catch (error) {
      alert('Error shipping product: ' + error.message);
    } finally {
      setTxLoading(false);
    }
  };

  const handleReceiveProduct = async () => {
    if (!contract || !account) return;
    
    try {
      setTxLoading(true);
      await contract.methods.receiveProduct(id, note).send({ from: account });
      setNote('');
      await fetchProductDetails();
    } catch (error) {
      alert('Error receiving product: ' + error.message);
    } finally {
      setTxLoading(false);
    }
  };

  const handleSellProduct = async () => {
    if (!contract || !account) return;
    
    try {
      setTxLoading(true);
      await contract.methods.sellProduct(id).send({ from: account });
      await fetchProductDetails();
    } catch (error) {
      alert('Error selling product: ' + error.message);
    } finally {
      setTxLoading(false);
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (!product) return <div className="card">Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      
      <div className="card">
        <h2>Product Details</h2>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Created:</strong> {product.createdAt}</p>
        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
        <p><strong>Current Owner:</strong> {product.currentOwner}</p>
        <p><strong>Status:</strong> {product.state}</p>
      </div>

      <div className="card">
        <h2>Update Status</h2>
        <div className="form-group">
          <label>Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this transition"
            rows="3"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {product.stateValue === 0 && (
            <button className="btn btn-primary" onClick={handleShipProduct} disabled={txLoading}>
              {txLoading ? 'Processing...' : 'Ship Product'}
            </button>
          )}
          {product.stateValue === 1 && (
            <button className="btn btn-primary" onClick={handleReceiveProduct} disabled={txLoading}>
              {txLoading ? 'Processing...' : 'Receive Product'}
            </button>
          )}
          {product.stateValue === 2 && (
            <button className="btn btn-primary" onClick={handleSellProduct} disabled={txLoading}>
              {txLoading ? 'Processing...' : 'Sell Product'}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Supply Chain History</h2>
        <div className="timeline">
          {history.map((record, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-date">{record.timestamp}</div>
              <div className="timeline-content">
                <p><strong>{record.state}</strong></p>
                <p>By: {record.actor}</p>
                <p>{record.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
