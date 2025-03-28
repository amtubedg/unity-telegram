import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// API для отправки или обновления Score
export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, username, score } = req.body;

  if (!userId || !username || score === undefined) {
    console.log("❌ Пустые данные:", req.body);
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    console.log("📥 Получены данные:", { userId, username, score });

    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      // Если пользователь уже есть — обновляем Score
      await userDocRef.update({ Score: score });
      console.log(`✅ Score обновлён для пользователя ${username}`);
    } else {
      // Если пользователя нет — создаём нового с Score
      await userDocRef.set({
        TelegramID: userId,
        Username: username,
        Score: score
      });
      console.log(`✅ Пользователь создан с Score ${score}`);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Ошибка при записи в Firestore:", err.message);
    res.status(500).json({ error: err.message });
  }
};
