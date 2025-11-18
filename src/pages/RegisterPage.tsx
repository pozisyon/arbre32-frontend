import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await AuthApi.register({ email, password });
      setSuccess("Compte créé avec succès. Vous pouvez vous connecter.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card-smooth px-6 py-5 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Créer un compte</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1 text-sm">
            <label>Email</label>
            <input type="email" className="w-full border dark:border-[#3a3b40] rounded px-3 py-2 bg-white dark:bg-[#2a2c31]" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1 text-sm">
            <label>Mot de passe</label>
            <input type="password" className="w-full border dark:border-[#3a3b40] rounded px-3 py-2 bg-white dark:bg-[#2a2c31]" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-1 text-sm">
            <label>Confirmer le mot de passe</label>
            <input type="password" className="w-full border dark:border-[#3a3b40] rounded px-3 py-2 bg-white dark:bg-[#2a2c31]" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
          {error && <div className="text-xs text-red-500">{error}</div>}
          {success && <div className="text-xs text-emerald-500">{success}</div>}
          <button className="w-full py-2 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm" disabled={loading}>
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>
        <div className="text-xs opacity-80">
          Déjà inscrit ? <Link to="/login" className="text-brand-600 hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
