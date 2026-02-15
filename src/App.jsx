/**
 * App Component
 * Root component dengan providers
 */

import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { router } from "@/router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Router */}
      <RouterProvider router={router} />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          classNames: {
            error: "bg-red-50 text-red-900 border-red-200",
            success: "bg-green-50 text-green-900 border-green-200",
            warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
            info: "bg-blue-50 text-blue-900 border-blue-200",
          },
        }}
      />

      {/* React Query Devtools (hanya di development) */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

export default App;
