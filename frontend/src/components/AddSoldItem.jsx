// AddSoldItem Modal Component
// Records sales transactions for inventory items
// Can be triggered generally from header or pre-bound to a specific product row
import { useState } from 'react';
import './AddProduct.css';

// Props:
// - onClose: Dismiss modal callback
// - products: Available product list for selection dropdown
// - initialProduct: Pre-selected product when clicked from a table row
// - onSaveSold: Callback returning the structured sold item payload
function AddSoldItem({ onClose, products = [], initialProduct = null, onSaveSold }) {
  const today = new Date().toISOString().split('T')[0];

  // Selected product identifier, defaults to pre-selected product or first available product
  const [selectedProductId, setSelectedProductId] = useState(
    initialProduct ? String(initialProduct.id) : (products[0] ? String(products[0].id) : '')
  );
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');

  // Resolve active product object
  const currentProduct = products.find(p => String(p.id) === String(selectedProductId)) || initialProduct;

  // Validate fields and pass the transaction record to the parent handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProduct) {
      alert('Please select a product first.');
      return;
    }

    const jumlah = parseInt(qty, 10);
    if (!jumlah || jumlah <= 0) {
      alert('Please enter a valid sold quantity (at least 1).');
      return;
    }

    if (onSaveSold) {
      onSaveSold({
        id: Date.now(),
        productId: currentProduct.id,
        nama: currentProduct.nama,
        harga: currentProduct.harga,
        qty: jumlah,
        date: date,
        note: note,
        total: currentProduct.harga * jumlah,
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {initialProduct ? `Catat Penjualan: ${initialProduct.nama}` : 'Catat Barang Terjual'}
          </h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Transaction Record Form */}
        <form className="product-form" onSubmit={handleSubmit}>
          {/* Dropdown only visible if opened from global header rather than specific row */}
          {!initialProduct && (
            <div className="form-group">
              <label className="form-label">Pilih Produk</label>
              <select
                className="form-input"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="" disabled>-- Pilih produk --</option>
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} (Stok: {item.stok}) - Rp {item.harga.toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jumlah Terjual</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Real-time Subtotal Preview */}
          {currentProduct && (
            <div style={{ fontSize: '0.82rem', color: '#666', background: '#faf9f7', padding: '10px 12px', borderRadius: '6px', border: '1px solid #eee' }}>
              <strong>Perkiraan Total: </strong> 
              <span style={{ color: '#2d7d46', fontWeight: '600' }}>
                Rp {((currentProduct.harga || 0) * (parseInt(qty, 10) || 0)).toLocaleString('id-ID')}
              </span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Catatan / Pembeli (Opsional)</label>
            <input
              type="text"
              className="form-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="cth. Kasir 1 / Meja 2"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-save">
              Simpan Penjualan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSoldItem;
