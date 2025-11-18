import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await AuthApi.login({ email, password });
      login(res.user, res.token);
      navigate("/lobby");
    } catch (err: any) {
      console.error(err);
      setError("Identifiants invalides ou erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card-smooth px-6 py-5 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Connexion</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1 text-sm">
            <label>Email</label>
            <input type="email" className="w-full border dark:border-[#3a3b40] rounded px-3 py-2 bg-white dark:bg-[#2a2c31]" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1 text-sm">
            <label>Mot de passe</label>
            <input type="password" className="w-full border dark:border-[#3a3b40] rounded px-3 py-2 bg-white dark:bg-[#2a2c31]" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-xs text-red-500">{error}</div>}
          <button className="w-full py-2 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <div className="text-xs opacity-80">
          Pas de compte ? <Link to="/register" className="text-brand-600 hover:underline">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
