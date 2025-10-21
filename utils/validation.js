// Custom URL validation function to replace validator.isURL()
const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

module.exports = {
  isValidURL,
};