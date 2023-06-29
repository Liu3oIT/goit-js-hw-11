import axios from 'axios';
export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 20;
  }

  async fetchHits() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY_URL = '37736916-e03abe6b2ffeaa8f87161d473';

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: this.searchQuery,
          image_type: 'photo',
          page: this.page,
          per_page: this.per_page,
          key: KEY_URL,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
