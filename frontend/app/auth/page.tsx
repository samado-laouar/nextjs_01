"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleAuth = async () => {
    setLoading(true);

    let result;
    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      alert(result.error.message);
    } else {
      alert(`Success! You are now ${mode}ed`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button className="w-full" onClick={handleAuth} disabled={loading}>
        {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
      </Button>

      <p
        className="text-sm text-gray-500 cursor-pointer underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}
