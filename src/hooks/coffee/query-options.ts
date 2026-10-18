import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createCoffeeTypeAction, fetchCoffeeTypesAction } from "@/server/coffee/action";

export const coffeeTypeKeys = {
    all: ["coffeeTypes"] as const,
};

export const coffeeTypesQuery = () =>
    queryOptions({
        queryKey: coffeeTypeKeys.all,
        queryFn: () => fetchCoffeeTypesAction(),
    });

export const createCoffeeTypeMutation = () =>
    mutationOptions({
        mutationFn: (name: string) => createCoffeeTypeAction(name),
    });
