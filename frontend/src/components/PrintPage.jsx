// PrintPage Component
// Generates a clean, print-ready document summarizing sold items and revenue calculations
// Features browser window.print() integration, media-print styling, and individual item deletion
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrintPage.css';

function PrintPage() {
  const [soldItems, setSoldItems] = useState([]);
  const navigate = useNavigate();

  // Load recorded sold items from browser storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toko_sold_items');
      if (stored) {
        setSoldItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read sold items from localStorage:', e);
    }
  }, []);

  // Reset all recorded sold item transactions
  const handleClearSoldItems = () => {
    if (window.confirm('Are you sure you want to reset and delete all recorded sold items?')) {
      localStorage.removeItem('toko_sold_items');
      setSoldItems([]);
    }
  };

  // Remove a specific sold transaction row and recalculate the report
  const handleDeleteIndividual = (idToDelete, indexToDelete) => {
    const updated = soldItems.filter((item, idx) =>
      item.id ? item.id !== idToDelete : idx !== indexToDelete
    );
    setSoldItems(updated);
    localStorage.setItem('toko_sold_items', JSON.stringify(updated));
  };

  // Aggregated calculations for total sold quantity and overall revenue
  const totalQty = soldItems.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0);
  const totalPendapatan = soldItems.reduce(
    (acc, curr) => acc + (Number(curr.total) || (Number(curr.harga) * Number(curr.qty)) || 0),
    0
  );

  // Formatted timestamp string for document header
  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="print-page-wrapper">
      {/* On-screen Action Bar (Automatically hidden when printed via CSS .no-print) */}
      <div className="print-action-bar no-print">
        <button className="btn-secondary" onClick={() => navigate('/')}>
          &larr; Kembali ke Daftar Produk
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {soldItems.length > 0 && (
            <button
              className="btn-secondary"
              style={{ color: '#c0392b', borderColor: '#f0c2bd' }}
              onClick={handleClearSoldItems}
            >
              Reset Semua Terjual
            </button>
          )}
          <button className="btn-primary-print" onClick={() => window.print()}>
            Cetak Dokumen
          </button>
        </div>
      </div>

      {/* Printable Sheet (Simulates physical document on screen, prints cleanly on paper/PDF) */}
      <div className="print-sheet">
        <div className="print-header">
          <div>
            <h1 className="print-doc-title">Laporan Barang Terjual</h1>
            <p className="print-doc-store">Rekapitulasi Penjualan Produk</p>
          </div>
          <div className="print-meta">
            <p><strong>Waktu Cetak:</strong> {tanggalCetak}</p>
            <p><strong>Jumlah Transaksi:</strong> {soldItems.length} transaksi</p>
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: '36px', textAlign: 'center' }}>No</th>
              <th style={{ width: '100px' }}>Tanggal</th>
              <th>Nama Barang Terjual</th>
              <th style={{ textAlign: 'right' }}>Harga Satuan</th>
              <th style={{ textAlign: 'center', width: '90px' }}>Jumlah</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
              <th className="no-print" style={{ width: '60px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {soldItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-print-cell">
                  Belum ada catatan barang terjual. Tambahkan melalui tombol &quot;+ Terjual&quot; di daftar produk.
                </td>
              </tr>
            ) : (
              soldItems.map((item, index) => {
                const subtotal = item.total || (item.harga * item.qty);
                return (
                  <tr key={item.id || index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ fontSize: '0.82rem', color: '#555' }}>
                      {item.date || '-'}
                    </td>
                    <td className="print-product-name">
                      {item.nama}
                      {item.note && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#777' }}>
                          Catatan: {item.note}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>
                      {item.qty}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      Rp {Number(subtotal).toLocaleString('id-ID')}
                    </td>
                    <td className="no-print" style={{ textAlign: 'center' }}>
                      <button
                        className="btn-delete-sold-item"
                        title="Hapus baris ini dari riwayat penjualan"
                        onClick={() => handleDeleteIndividual(item.id, index)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="4" style={{ textAlign: 'right' }}>Total Penjualan:</th>
              <th style={{ textAlign: 'center' }}>{totalQty} item</th>
              <th style={{ textAlign: 'right', color: '#2d7d46' }}>
                Rp {totalPendapatan.toLocaleString('id-ID')}
              </th>
              <th className="no-print"></th>
            </tr>
          </tfoot>
        </table>

        {/* Signature Area for printed verification */}
        <div className="print-signature-area">
          <div className="signature-box">
            <p>Penanggung Jawab,</p>
            <div className="signature-space"></div>
            <p>( .................................... )</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintPage;
