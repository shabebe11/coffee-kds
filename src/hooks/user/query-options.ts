import { mutationOptions } from "@tanstack/react-query";
import { createUserAction, type NewUserInput } from "@/server/user/action";

export const createUserMutation = () =>
    mutationOptions({
        mutationFn: (input: NewUserInput) => createUserAction(input),
    });
