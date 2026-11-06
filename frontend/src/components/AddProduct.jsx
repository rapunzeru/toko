import './AddProduct.css';

function AddProduct({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tambah Produk Baru</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form className="product-form">
          <div className="form-group">
            <label className="form-label">Nama Produk</label>
            <input
              type="text"
              className="form-input"
              placeholder="cth. Indomie Goreng"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Harga (Rp)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stok</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-save">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
