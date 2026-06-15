import { useMutation } from "@tanstack/react-query";
import { updateEmail } from "../../services/auth.service"; 

export const useUpdateEmail = (userId: string) => {
  return useMutation({
    mutationFn: (newEmail: string) => {
      return updateEmail(userId, newEmail);
    },
  });
};