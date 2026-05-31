window.api = window.api || {
  /**
   * Retrieves the user's language code from the browser.
   * @returns {Promise<string>} A promise that resolves to the browser's language code (e.g., 'en', 'es').
   */
  getLocale: () => Promise.resolve((navigator.language || 'en').split('-')[0]),
};
