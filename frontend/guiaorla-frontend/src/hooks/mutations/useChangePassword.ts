import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../services/auth.service"; 

export const useChangePassword = (userId: string) => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      return changePassword(userId, data);
    },
  });
};