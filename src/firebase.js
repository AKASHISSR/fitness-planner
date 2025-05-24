import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyALOlJat7fxD5MpAaftT_e3KhTkDoWuxZw",
  authDomain: "fitness-planner-d6cf0.firebaseapp.com",
  projectId: "fitness-planner-d6cf0",
  storageBucket: "fitness-planner-d6cf0.appspot.com",
  messagingSenderId: "968893369273",
  appId: "1:968893369273:web:cf83a0d67ce62e557cc468"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const IMGBB_API_KEY = 'dd458df7e7be1cfa4a6c9f57a909237f';

// Логирование захода
export async function logVisit({ email, ip, userAgent, page }) {
  try {
    await addDoc(collection(db, 'visit_logs'), {
      email: email || null,
      ip: ip || null,
      userAgent: userAgent || null,
      page: page || null,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    // Ошибки можно логировать в консоль
    // console.error('Ошибка логирования визита:', e);
  }
}

// Логирование пользовательской активности (покупки, опросы, входы и т.д.)
export async function logUserActivity({ email, type, desc }) {
  try {
    await addDoc(collection(db, 'user_activity'), {
      email: email || null,
      type: type || null,
      desc: desc || null,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    // console.error('Ошибка логирования активности:', e);
  }
}

// Функция для безопасного имени файла из email
function safeEmail(email) {
  return email.replace(/[^a-zA-Z0-9]/g, '_');
}

// Загрузка аватара пользователя
export async function uploadUserAvatar(email, file) {
  if (!email || !file) throw new Error('Нет email или файла');
  const avatarRef = ref(storage, `avatars/${safeEmail(email)}`);
  await uploadBytes(avatarRef, file);
  const url = await getDownloadURL(avatarRef);
  // Сохраняем ссылку в Firestore
  await setDoc(doc(db, 'users', email), { avatar: url }, { merge: true });
  return url;
}

// Получение ссылки на аватар пользователя
export async function getUserAvatar(email) {
  if (!email) return null;
  const docRef = doc(db, 'users', email);
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().avatar) {
    return snap.data().avatar;
  }
  return null;
}

// Загрузка аватара пользователя через imgbb
export async function uploadUserAvatarToImgbb(email, file) {
  if (!email || !file) throw new Error('Нет email или файла');
  // Читаем файл как base64
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
  const imageBase64 = await toBase64(file);
  // Загружаем на imgbb
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', imageBase64);
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!data.success) throw new Error('Ошибка загрузки на imgbb');
  const url = data.data.url;
  // Сохраняем ссылку в Firestore
  await setDoc(doc(db, 'users', email), { avatar: url }, { merge: true });
  return url;
} 