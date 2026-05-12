"use client";

import { useSession } from "next-auth/react";

export default function TestePage() {
  const { data } = useSession();

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}