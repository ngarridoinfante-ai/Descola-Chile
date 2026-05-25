"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dumbbell } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Completa todos los campos"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    setLoading(true);
    try {
      // Demo: redirect to profile setup. In production: Supabase Auth signUp
      await new Promise((r) => setTimeout(r, 800));
      router.push("/profile");
    } catch {
      setError("No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-[#0A0A0F]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green/10 border border-green/20 glow-green">
            <Dumbbell size={28} className="text-green" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary">Crea tu cuenta</h1>
            <p className="text-sm text-text-secondary mt-1">Empieza tu transformación hoy</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nicolás" autoComplete="name" />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
          {error && <p className="text-sm text-red-alert text-center">{error}</p>}
          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Crear cuenta
          </Button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-text-muted">¿Ya tienes cuenta? </span>
          <Link href="/login" className="text-sm text-green font-medium hover:text-green-dim transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
