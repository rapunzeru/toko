// Sold Item Data Access Object (DAO) for Frontend
// Abstracts storage operations for sold items (Local Storage / Cache layer)
const STORAGE_KEY = 'toko_sold_items';

export const soldItemDao = {
  // Retrieve all recorded sold items from persistent storage
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Failed to read sold items from storage:', error);
      return [];
    }
  },

  // Append and save a new sold item record
  save(soldData) {
    try {
      const existing = this.getAll();
      const updated = [...existing, soldData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to save sold item to storage:', error);
      throw error;
    }
  },

  // Delete a sold item by ID or array index
  delete(idToDelete, indexToDelete) {
    try {
      const existing = this.getAll();
      const updated = existing.filter((item, idx) =>
        item.id ? item.id !== idToDelete : idx !== indexToDelete
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to delete sold item from storage:', error);
      throw error;
    }
  },

  // Clear all recorded sold items
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    } catch (error) {
      console.error('Failed to clear sold items from storage:', error);
      throw error;
    }
  },
};
