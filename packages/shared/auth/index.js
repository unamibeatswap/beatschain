const fs = require('fs');

function tryInitFirebase() {
  try {
    const admin = require('firebase-admin');
    return admin;
  } catch (e) {
    return null;
  }
}

async function verifyFirebaseIdToken(idToken) {
  const admin = tryInitFirebase();
  if (!admin) {
    // dev fallback
    return { uid: 'dev-' + Math.random().toString(36).slice(2, 8), email: null };
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email || null };
  } catch (e) {
    throw e;
  }
}

module.exports = { verifyFirebaseIdToken };
