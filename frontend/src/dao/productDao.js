// Product Data Access Object (DAO) for Frontend
// Abstracts HTTP API communication and error handling for product entities
const API_BASE_URL = 'http://localhost:5000/api/products';

export const productDao = {
  // Fetch all products from the backend server
  async getAll() {
    const response = await fetch(API_BASE_URL);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response (${response.status}): ${text.slice(0, 80)}`);
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch products');
    }

    return data;
  },

  // Create and persist a new product to the database via backend API
  async create(productData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(
        response.status === 404
          ? 'Endpoint 404 Not Found. Make sure backend is running.'
          : `Server returned non-JSON response (${response.status}): ${text.slice(0, 80)}`
      );
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save product to database');
    }

    return data;
  },
};
