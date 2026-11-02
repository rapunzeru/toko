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
    // Display the list of products
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2>Daftar Produk Toko</h2>
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <ul>
            {products.length === 0 ? (
              <p>Belum ada produk di database.</p>
            ) : (
              products.map((item) => (
                <li key={item.id}>
                  <strong>{item.nama}</strong> - Rp {item.harga} (Stok: {item.stok})
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  }

export default App;