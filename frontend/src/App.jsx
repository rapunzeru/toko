import { useState, useEffect } from 'react';
import './App.css';
import AddProduct from './components/AddProduct';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
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
        console.error('Gagal konek ke backend:', err);
        setLoading(false);
      });
  }, []);

  return (
      <div className="app-wrapper">
        <div className="app-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Produk Toko</h1>
              <p className="page-subtitle">{products.length} produk terdaftar</p>
            </div>
            <button className="btn-add" onClick={() => setShowAdd(true)}>Tambah Produk</button>
          </div>

          {loading ? (
            <p className="loading-text">Memuat data...</p>
          ) : (
            <div className="table-wrapper">
              <table className="product-table">
                <thead className="table-head">
                  <tr>
                    <th className="table-header">#</th>
                    <th className="table-header">Produk</th>
                    <th className="table-header">Harga</th>
                    <th className="table-header">Stok</th>
                    <th className="table-header"></th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-text">
                        Belum ada produk. Mulai dengan menambahkan satu!
                      </td>
                    </tr>
                  ) : (
                    products.map((item, index) => (
                      <tr key={item.id} className="table-row">
                        <td className="table-cell cell-number">{index + 1}</td>
                        <td className="table-cell cell-name">{item.nama}</td>
                        <td className="table-cell cell-price">
                          Rp {item.harga.toLocaleString('id-ID')}
                        </td>
                        <td className="table-cell cell-stock">{item.stok} pcs</td>
                        <td className="table-cell cell-action">
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Hapus</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Ini akan me-render AddProduct sebagai komponen di atas (pastikan CSS AddProduct punya posisi absolute/fixed) */}
          {showAdd && <AddProduct onClose={() => setShowAdd(false)} />}
        </div>
      </div>
  );
}

export default App;