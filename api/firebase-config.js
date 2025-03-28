import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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

async function sendScore(userId) {
  try {
    // Получаем score через prompt
    const score = parseInt(prompt("Введите ваш Score:"), 10);

    if (isNaN(score)) {
      alert("Некорректное значение. Введите число.");
      return;
    }

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Если пользователь найден — обновляем Score
      await updateDoc(userDocRef, {
        Score: score
      });
      alert(`Score успешно обновлён: ${score}`);
    } else {
      // Если пользователя нет — создаём нового с Score
      await setDoc(userDocRef, {
        TelegramID: userId,
        Score: score
      });
      alert(`Пользователь создан с Score: ${score}`);
    }
    console.log(`✅ Score отправлен в Firestore: ${score}`);
  } catch (error) {
    console.error("❌ Ошибка при отправке Score:", error);
    alert("Произошла ошибка при отправке Score.");
  }
}

if (userId) {
  sendScore(userId);
} else {
  console.error("Ошибка: UserID не найден.");
}