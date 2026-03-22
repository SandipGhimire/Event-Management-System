import { useLoaderStore } from "@/store/app/loader.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { useNavigate } from "react-router";

export default function Login() {
  const { loginDetail, login, setLoginDetail } = useAuthStore();
  const { isLoading } = useLoaderStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await login(() => {
      navigate("/dashboard");
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-lg shadow-lg border border-border p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="block w-8 h-1 rounded-full bg-primary"></span>
            <span className="block w-3 h-3 rounded-full bg-secondary"></span>
            <span className="block w-8 h-1 rounded-full bg-primary"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Welcome Back</h1>
          <p className="text-text-secondary mt-1 text-sm">Sign in to your account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={loginDetail.email}
              onChange={(e) => setLoginDetail({ ...loginDetail, email: e.target.value })}
              className="input-full"
              placeholder="e.g. john@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={loginDetail.password}
              onChange={(e) => setLoginDetail({ ...loginDetail, password: e.target.value })}
              className="input-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg w-full ${isLoading("login") ? "btn-loading" : ""}`}
            disabled={isLoading("login")}
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1">
          <span className="block w-12 h-[2px] bg-border"></span>
          <span className="block w-2 h-2 rounded-full bg-secondary"></span>
          <span className="block w-12 h-[2px] bg-border"></span>
        </div>
        <div className="text-center mt-4 text-xs">
          Made with passion by{" "}
          <a href="https://github.com/SandipGhimire" className="text-primary hover:underline">
            Sandip Ghimire
          </a>
        </div>
      </div>
    </div>
  );
}
