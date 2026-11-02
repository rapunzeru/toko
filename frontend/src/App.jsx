import { useState, useEffect } from 'react';

function App() {
  const [pesan, setPesan] = useState("Menunggu API...");

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then(res => res.json())
      .then(data => setPesan(data.message))
      .catch(err => setPesan("Gagal konek ke backend"));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Tes Fullstack</h2>
      <p>Status: <strong>{pesan}</strong></p>
    </div>
  );
}

export default App;