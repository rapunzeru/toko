// AddProduct Modal Component
// Displays a modal form allowing users to register a new product
// Submits the payload to POST /api/products and updates the parent state
import { useState } from 'react';
import './AddProduct.css';

// Props:
// - onClose: Callback to close the modal
// - onProductAdded: Callback invoked with the newly created product
function AddProduct({ onClose, onProductAdded }) {
  // Local form state
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission, validate client fields, and POST to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!nama.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!harga || Number(harga) < 0) {
      setError('Price must be a valid positive number.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: nama.trim(),
          harga: Number(harga),
          stok: stok !== '' ? Number(stok) : 0,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textError = await response.text();
        throw new Error(
          response.status === 404
            ? 'Endpoint 404 Not Found. Pastikan server backend sudah direstart agar rute baru POST /api/products aktif.'
            : `Server mengembalikan respon bukan JSON (${response.status}): ${textError.slice(0, 80)}`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan produk ke database.');
      }

      // Notify parent to append product without a full page refresh
      if (onProductAdded) {
        onProductAdded(data);
      }

      onClose();
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'An error occurred while communicating with the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Tambah Produk Baru</h2>
          <button className="modal-close" onClick={onClose} disabled={submitting}>
            &times;
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            backgroundColor: '#fdf0ef',
            color: '#c0392b',
            border: '1px solid #f9d5d2',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            marginBottom: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Product Creation Form */}
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Produk</label>
            <input
              type="text"
              className="form-input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="cth. Indomie Goreng"
              disabled={submitting}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Harga (Rp)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="0"
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stok Awal</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="0"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
