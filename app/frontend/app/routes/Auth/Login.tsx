import { useState } from "react";
import { useAuthStore } from "../../store/Auth/auth.store";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-secondary rounded-2xl shadow-2xl border border-gray-800 p-8 transform transition-all">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 2v0c4.923 0 9.233 3.576 10.201 8.356M4.99 8.05a10.29 10.29 0 018.13-5.33M16 18l4-4m0 0l-4-4m4 4H8"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Access your account with your credentials</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="e.g. john@example.com"
              required
            />
          </div>

          <div className="input-group">
            <div className="flex justify-between">
              <label className="input-label">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-700 bg-bg-dark text-primary focus:ring-primary/20"
            />
            <span className="ml-2 text-sm text-gray-400">Remember session</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary btn-lg w-full ${isLoading ? "btn-loader" : ""}`}
          >
            {isLoading ? "" : "Sign In to Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
