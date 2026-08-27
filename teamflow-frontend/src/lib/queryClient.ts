import { QueryClient } from "@tanstack/react-query";

// One QueryClient for the whole app. It holds the cache for every
// useQuery call (projects list, project details, etc).
//
// staleTime: how long cached data is considered "fresh" before React
// Query will refetch it in the background. 30s is plenty for a small
// internal tool — it avoids refetching on every tab switch while still
// keeping data reasonably current.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
