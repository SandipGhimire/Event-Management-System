import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20" />

      {/* Fun Geometric Shapes for background flair */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="max-w-md w-full text-center z-10 space-y-5 animate-fade-in-up">
        {/* Large Floating 404 */}
        <div className="relative inline-block">
          <h1 className="text-9xl font-black text-primary tracking-tighter drop-shadow-2xl">404</h1>
          <div className="absolute w-full flex items-center justify-center animate-float top-[48%]">
            <span className="text-2xl w-6 h-6 bg-primary shadow-lg rounded-full" role="img" aria-label="shrug"></span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-text-primary italic">"Even the best volunteer get lost."</h2>
          <div className="text-lg text-text-secondary leading-relaxed space-y-2">
            <p>
              Look at you, <span className="text-primary font-bold">Mr. Volunteer</span>, trying to access a page that
              doesn't even exist in your own database.
            </p>
            <p>
              This page didn't sign the attendance sheet today. It's officially a{" "}
              <span className="text-error font-semibold underline decoration-wavy">No-Show</span>.
            </p>
            <p className="text-sm opacity-75">
              Maybe check the event schedule? Or just admit you clicked a broken link.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            to="/login"
            className="btn btn-secondary btn-lg inline-flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-secondary/20"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to the Command Center
          </Link>
        </div>

        {/* Easter Egg / Sarcastic Note */}
        <p className="text-xs text-text-secondary/50 pt-12 italic">
          * Note: No database records were corrupted in the making of this error. The server just thinks you're being a
          bit too adventurous.
        </p>
      </div>
    </div>
  );
}
