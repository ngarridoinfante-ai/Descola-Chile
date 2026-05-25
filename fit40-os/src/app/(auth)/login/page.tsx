"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dumbbell } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Completa todos los campos"); return; }
    setLoading(true);
    try {
      // Demo login: redirect directly. In production: Supabase Auth
      await new Promise((r) => setTimeout(r, 800));
      router.push("/dashboard");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-[#0A0A0F]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green/10 border border-green/20 glow-green">
            <Dumbbell size={28} className="text-green" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">Fit40 OS</h1>
            <p className="text-sm text-text-secondary mt-1">Tu sistema operativo físico</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-alert text-center">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Iniciar sesión
          </Button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-text-muted">¿No tienes cuenta? </span>
          <Link href="/register" className="text-sm text-green font-medium hover:text-green-dim transition-colors">
            Crear cuenta
          </Link>
        </div>

        {/* Demo hint */}
        <div className="mt-6 bg-elevated rounded-xl border border-border p-3 text-center">
          <p className="text-xs text-text-muted">
            <span className="text-text-secondary font-medium">Demo:</span> ingresa cualquier email y contraseña
          </p>
        </div>
      </div>
    </div>
  );
}
