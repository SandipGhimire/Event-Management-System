import type { ContentLayoutProps } from "@/core/types/component/contentLayout.type";

export default function ContentLayout({ header, buttons = [], children }: ContentLayoutProps) {
  return (
    <>
      <div className="bg-white border rounded-sm mb-12 relative">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="font-bold text-xl text-primary">{header}</div>
          <div className="flex gap-1">
            {buttons.map((button, index) => (
              <button key={index} className={`btn ${button.className}`} onClick={button.onClick}>
                {button.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[calc(100dvh-13rem)] min-h-[calc(100dvh-13rem)] overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
