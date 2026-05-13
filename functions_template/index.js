const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();


exports.onLikeAdded = functions.firestore
  .document('likes/{likeId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const tipId = data.tipId;

    if (!tipId) return null;

    const tipRef = db.collection('tips').doc(tipId);

    return tipRef.update({
      likes: admin.firestore.FieldValue.increment(1)
    });
  });


exports.onLikeRemoved = functions.firestore
  .document('likes/{likeId}')
  .onDelete(async (snap, context) => {
    const data = snap.data();
    const tipId = data.tipId;

    if (!tipId) return null;

    const tipRef = db.collection('tips').doc(tipId);

    return tipRef.update({
      likes: admin.firestore.FieldValue.increment(-1)
    });
  });
