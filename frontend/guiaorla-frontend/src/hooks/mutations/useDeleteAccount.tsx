import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../../services/auth.service"; 

export const useDeleteAccount = (userId: string) => {
  return useMutation({
    mutationFn: () => {
      return deleteAccount(userId);
    },
  });
};