import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9r3JeH0DZNWymK9j4Dog2ZNu73kI1VjE",
  authDomain: "nwitter-reloaded-cbcc8.firebaseapp.com",
  projectId: "nwitter-reloaded-cbcc8",
  storageBucket: "nwitter-reloaded-cbcc8.appspot.com",
  messagingSenderId: "304945084345",
  appId: "1:304945084345:web:8542cb4fe89ec82cd86868",
};
// 터미널에서 firebase설치 후 firebase에서 제공해주는 코드 복붙

const app = initializeApp(firebaseConfig);
// 해당 Config 옵션을 통해서 app을 생성하는 코드

export const auth = getAuth(app);
// 개발자가 authentication을 원한다는 코드를 작성해 줘야함
// app에 대한 인증 서비스를 사용하고 싶다는 의미의 코드

export const storage = getStorage(app);

export const db = getFirestore(app);
