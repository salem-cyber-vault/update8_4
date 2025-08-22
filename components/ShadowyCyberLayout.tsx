import * as React from "react";
import FloatingEyesBackground from "./FloatingEyesBackground";

export default function ShadowyCyberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-slate-100">
      <FloatingEyesBackground />
      <main className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
        {children}
      </main>
    </div>
  );
}
