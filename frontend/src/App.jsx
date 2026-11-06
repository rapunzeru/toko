// Application Entry & Navigation
// Configures client-side routing and contains the main inventory management view
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import AddProduct from './components/AddProduct';
import AddSoldItem from './components/AddSoldItem';
import PrintPage from './components/PrintPage';

// ProductList Component
// Displays the product inventory table, sold items tracker, and triggers modals
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddSold, setShowAddSold] = useState(false);
  const [selectedProductForSell, setSelectedProductForSell] = useState(null);
  const [soldCount, setSoldCount] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  // Fetch initial product list from backend and sync saved sold items count
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Server mengembalikan HTML/non-JSON (${res.status}). Pastikan backend berjalan.`);
        }
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Gagal mengambil data produk dari server');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Backend connection error:', err);
        setLoading(false);
      });

    // Check count of stored sold item records
    try {
      const saved = JSON.parse(localStorage.getItem('toko_sold_items') || '[]');
      setSoldCount(saved.length);
    } catch (e) {
      console.error('Failed to parse sold items from localStorage:', e);
    }
  }, []);

  // Open the sale modal for a specific row/product
  const handleOpenSellRow = (item) => {
    setSelectedProductForSell(item);
    setShowAddSold(true);
  };

  // Open the generic sale modal from the header actions
  const handleOpenSellHeader = () => {
    setSelectedProductForSell(null);
    setShowAddSold(true);
  };

  // Save a newly recorded sold item to localStorage and update badge count
  const handleSaveSold = (soldData) => {
    try {
      const stored = JSON.parse(localStorage.getItem('toko_sold_items') || '[]');
      const updated = [...stored, soldData];
      localStorage.setItem('toko_sold_items', JSON.stringify(updated));
      setSoldCount(updated.length);
    } catch (err) {
      console.error('Failed to save sold item to localStorage:', err);
    }
  };

  // Callback invoked when a new product is successfully stored in the database
  // Updates state immediately without requiring a full page reload
  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  // Handle user session logout action
  const handleLogout = () => {
    setShowUserDropdown(false);
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      alert('Anda telah berhasil keluar dari akun Admin.');
    }
  };

  return (
    <div className="app-wrapper">
      {/* Top Header Navbar */}
      <header className="top-navbar">
        <div className="top-navbar-inner">
          <div className="navbar-brand-left">
            <span className="brand-tag">Inventaris</span>
          </div>

          <div className="navbar-shop-name">
            Toko Kita
          </div>

          <div className="navbar-user-right">
            <button
              className="user-profile-btn"
              onClick={() => setShowUserDropdown((prev) => !prev)}
              title="Menu Pengguna"
              type="button"
            >
              <div className="user-info">
                <span className="user-name">Admin Toko</span>
                <span className="user-status">Online</span>
              </div>
              <div className="user-avatar" title="Pengguna Aktif: Admin Toko">
                AD
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <>
                <div
                  className="dropdown-backdrop"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="user-dropdown-menu">
                  <div className="dropdown-user-header">
                    <p className="dropdown-user-name">Admin Toko</p>
                    <p className="dropdown-user-email">admin@tokokita.com</p>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowProfileModal(true);
                    }}
                  >
                    Profil Saya
                  </button>
                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Keluar (Log out)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="app-container">
        {/* Page Header and Action Buttons */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Produk Toko</h1>
            <p className="page-subtitle">{products.length} produk terdaftar</p>
          </div>
          <div className="header-actions">
            <button className="btn-print" onClick={() => navigate('/print')}>
              Print Sold Item {soldCount > 0 && `(${soldCount})`}
            </button>
            <button className="btn-add" onClick={() => setShowAdd(true)}>
              Tambah Produk
            </button>
          </div>
        </div>

        {/* Product Table or Loading State */}
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
                        <button
                          className="btn-sold-row"
                          title="Catat barang terjual untuk produk ini"
                          onClick={() => handleOpenSellRow(item)}
                        >
                          + Terjual
                        </button>
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

        {/* Modals */}
        {showAdd && (
          <AddProduct
            onClose={() => setShowAdd(false)}
            onProductAdded={handleProductAdded}
          />
        )}
        {showAddSold && (
          <AddSoldItem
            products={products}
            initialProduct={selectedProductForSell}
            onSaveSold={handleSaveSold}
            onClose={() => {
              setShowAddSold(false);
              setSelectedProductForSell(null);
            }}
          />
        )}

        {/* User Profile Modal */}
        {showProfileModal && (
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Profil Pengguna</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowProfileModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="profile-card-header">
                <div className="profile-avatar-large">AD</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1a1a1a' }}>Admin Toko</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#777' }}>Administrator Sistem</p>
                </div>
              </div>

              <div className="profile-details-list">
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Email:</span>
                  <span className="profile-detail-value">admin@tokokita.com</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Nama Toko:</span>
                  <span className="profile-detail-value">Toko Kita</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Status Akun:</span>
                  <span className="profile-detail-value" style={{ color: '#2d7d46' }}>Aktif (Online)</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Terdaftar Sejak:</span>
                  <span className="profile-detail-value">1 Januari 2026</span>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  style={{ width: '100%', textAlign: 'center' }}
                  onClick={() => setShowProfileModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Root Application Component
// Defines Route paths:
// "/"      : Main inventory dashboard
// "/print" : Printable sold items report
function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/print" element={<PrintPage />} />
    </Routes>
  );
}

export default App;
