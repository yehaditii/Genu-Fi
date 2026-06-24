import { useCallback, useState } from "react";

export function useContract<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);

      try {
        return await action(...args);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Contract action failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [action]
  );

  return { execute, isLoading, error };
}
