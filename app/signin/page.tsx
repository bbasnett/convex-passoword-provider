"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
      <p>Log in to see the numbers</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          await signIn("password", formData)
            .catch((error) => {
              console.log('ERROR IS :', error)
              const errorString = String(error);
              // Try to match the complex server error format first
              const serverMatch = errorString.match(/Error: \[Request ID: [a-z0-9]+\] Server Error\s*Uncaught ConvexError:\s*(.*)/);
              console.log(serverMatch)
              // If that doesn't match, try to extract from the simple error format
              const simpleMatch = errorString.match(/Error signing in:\s*(.*)/);
              if (serverMatch && serverMatch[1]) {
                setError(serverMatch[1].trim());
              } else if (simpleMatch && simpleMatch[1]) {
                setError(simpleMatch[1].trim());
              } else {
                setError("An unexpected error occurred");
              }
            })
            .then(() => {
              router.push("/");
            });
        }}
      >
        <input
          className="bg-background text-foreground rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
          // type="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="bg-background text-foreground rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          className="bg-foreground text-background rounded-md"
          type="submit"
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="flex flex-row gap-2">
          <span>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="text-foreground underline hover:no-underline cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </span>
        </div>
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
            <p className="text-foreground font-mono text-xs">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
