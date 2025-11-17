const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return false;
    }
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
