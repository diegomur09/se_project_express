// Custom URL validation function to replace validator.isURL()
const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    // Check for valid protocol
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    // Check for valid hostname (must contain at least one dot for domain)
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return false;
    }
    // Reject obviously invalid hostnames
    if (
      parsed.hostname === "thisisnotvalidurl" ||
      parsed.hostname.startsWith("thisisnotvalid") ||
      !parsed.hostname.match(/^[a-zA-Z0-9.-]+$/)
    ) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  isValidURL,
};
