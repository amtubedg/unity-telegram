import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export default async (req, res) => {
  const { userId, username } = req.body;

  try {
    await db.collection("users").doc(userId).set({
      TelegramID: userId,
      Username: username
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
