import AuthGate from "@/app/components/auth-gate";

export default function RegisterPage() {
  return <AuthGate initialMode="register" />;
}
