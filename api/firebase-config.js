import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";


const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { userId, username } = req.body;
  if (!userId || !username) {
    console.log("❌ Пустые данные:", req.body);
    return res.status(400).json({ error: "Missing data" });
  }
  try {
    console.log("📥 Получены данные:", { userId, username });

    await db.collection("users").doc(userId).set({
      TelegramID: userId,
      Username: username
    });
    console.log("✅ Успешно записано в Firestore");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Ошибка записи в Firestore:", err.message);
    res.status(500).json({ error: err.message });
  }
};
