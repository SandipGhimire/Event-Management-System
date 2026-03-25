import type { ModalProps } from "@/core/types/component/modal";

export default function Modal({ header, buttons = [], children }: ModalProps) {
  return (
    <>
      <div className="bg-white border rounded-sm mb-12 relative">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="font-bold text-xl text-primary">
            {header.label}
            <span className="ml-1 font-bold! text-[14px]! text-secondary!">
              {header.count || header.count == 0 ? `(${header.count})` : ""}
            </span>
          </div>
          <div className="flex gap-1">
            {buttons.map((button, index) => (
              <button key={index} className={`btn ${button.className}`} onClick={button.onClick}>
                {button.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[calc(100dvh-13rem)] overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
