"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data, status } = useSession();

  return {
    user: data?.user,
    token: data?.accessToken,
    authenticated: status === "authenticated",
    loading: status === "loading",
  };
}