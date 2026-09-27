import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
} from "../api/budget.api";

export const useBudgets = () =>
  useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

export const useBudget = (id) =>
  useQuery({
    queryKey: ["budget", id],
    queryFn: () => getBudgetById(id),
    enabled: Boolean(id),
  });

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget", variables.id] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });
};
