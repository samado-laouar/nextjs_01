"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";
import { redirect, useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      redirect('/admin/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

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

      <Button className="w-full" onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </Button>

      <p
        className="text-sm text-gray-500 cursor-pointer underline"
        onClick={() => router.push("/auth/signup")}
      >
        Don’t have an account? Sign Up
      </p>
    </div>
  );
}
