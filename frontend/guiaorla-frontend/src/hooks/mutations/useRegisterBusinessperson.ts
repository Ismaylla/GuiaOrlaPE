"use client";

import { registerBusinessperson } from "@/services/businessPersonService";
import { useMutation } from "@tanstack/react-query";

export function useRegisterBusinessperson() {
  return useMutation({
    mutationFn: registerBusinessperson,
  });
}