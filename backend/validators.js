// validators.js

// Short code: 6–8 alphanumeric characters
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidCode(code) {
  if (typeof code !== 'string') return false;
  return CODE_REGEX.test(code);
}

function isValidUrl(urlString) {
  if (typeof urlString !== 'string') return false;
  try {
    const url = new URL(urlString);
    // Allow only http / https
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// IMPORTANT: export all three as properties
module.exports = {
  isValidCode,
  isValidUrl,
  generateCode
};
