import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  //getting the products from the backend
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal konek ke backend:", err);
        setLoading(false);
      });
  }, []);

  return (
      <div className="app-wrapper">
        <div className="app-container">
          <h1 className="page-title">Daftar Produk Toko</h1>
          
          {loading ? (
            <p className="loading-text">Memuat data dari database...</p>
          ) : (
            <div className="product-grid">
              {products.length === 0 ? (
                <p className="empty-text">Belum ada produk di database.</p>
              ) : (
                products.map((item) => (
                  <div key={item.id} className="product-card">
                    <h2 className="product-title">{item.nama}</h2>
                    <p className="product-price">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </p>
                    <p className="product-stock">Stok: {item.stok}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

export default App;