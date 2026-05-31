"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="max-w-md w-full relative z-10">
        <SignIn 
          appearance={{
            elements: {
              card: "shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50 rounded-[2rem]",
              headerTitle: "text-2xl font-black text-ink tracking-tight",
              headerSubtitle: "text-mute",
              socialButtonsBlockButton: "rounded-full border-gray-200/60 hover:bg-surface-soft transition-colors",
              formButtonPrimary: "bg-primary hover:bg-primary-pressed text-white rounded-full font-bold btn-magnetic",
              formFieldInput: "rounded-[1rem] border-gray-200/60 focus:border-primary focus:ring focus:ring-primary/20 transition-all",
              footerActionLink: "text-primary hover:text-primary-pressed font-semibold",
              identityPreviewEditButton: "text-primary hover:text-primary-pressed",
              formFieldLabel: "text-ink-soft font-semibold",
              dividerLine: "bg-gray-100",
              dividerText: "text-mute"
            }
          }}
        />
      </div>
    </div>
  );
}
