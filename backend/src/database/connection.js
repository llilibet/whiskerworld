const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

if (!admin.apps.length) {
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    credential = admin.credential.cert(require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)));
  } else {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'whiskerworld-ea08d.firebasestorage.app',
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function salvarFotoNoStorage(file, nomeAnimal) {
  const ext = path.extname(file.originalname);
  const nomeSlug = (nomeAnimal || 'animal')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
  const filename = `animais/${nomeSlug}-${Date.now()}${ext}`;
  const fileRef = bucket.file(filename);
  await fileRef.save(file.buffer, { metadata: { contentType: file.mimetype } });
  await fileRef.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

module.exports = { db, bucket, salvarFotoNoStorage };
