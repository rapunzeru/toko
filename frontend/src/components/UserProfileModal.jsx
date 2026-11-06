// UserProfileModal Component
// Displays detailed information about the currently logged in user profile
import './UserProfileModal.css';

// Props:
// - onClose: Callback to dismiss the profile modal
// - user: Optional user details object (defaults to Admin Toko profile)
function UserProfileModal({ onClose, user = null }) {
  const defaultUser = {
    name: 'Admin Toko',
    role: 'Administrator Sistem',
    email: 'admin@tokokita.com',
    storeName: 'Toko Kita',
    status: 'Aktif (Online)',
    joinedDate: '1 Januari 2026',
    initials: 'AD',
  };

  const profile = user || defaultUser;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="profile-modal-header">
          <h2 className="profile-modal-title">Profil Pengguna</h2>
          <button
            type="button"
            className="profile-modal-close"
            onClick={onClose}
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="profile-card-header">
          <div className="profile-avatar-large">
            {profile.initials}
          </div>
          <div className="profile-user-headline">
            <h3>{profile.name}</h3>
            <p>{profile.role}</p>
          </div>
        </div>

        {/* Profile Information List */}
        <div className="profile-details-list">
          <div className="profile-detail-row">
            <span className="profile-detail-label">Email:</span>
            <span className="profile-detail-value">{profile.email}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Nama Toko:</span>
            <span className="profile-detail-value">{profile.storeName}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Status Akun:</span>
            <span className="profile-status-badge">{profile.status}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Terdaftar Sejak:</span>
            <span className="profile-detail-value">{profile.joinedDate}</span>
          </div>
        </div>

        {/* Modal Action Button */}
        <div>
          <button
            type="button"
            className="btn-profile-close"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileModal;
