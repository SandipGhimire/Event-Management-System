import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-border mt-auto h-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-text-secondary">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-primary">Attendee Management System</span>. All sessions managed.
        </p>
        <div className="flex items-center gap-4 text-xs font-medium text-primary">
          <a href="#" className="hover:underline italic">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline italic">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
