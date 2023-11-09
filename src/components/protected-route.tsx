import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  // 로그인이 되어있지 않은 유저는 로그인 화면으로 리다이렉트
  // 로그인이 되어있으면 홈화면 그대로 출력
  return children;
}
