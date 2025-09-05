

import React, { Suspense } from "react";
import SearchPage from "./SearchPage";
import Loading from "@/Shared/LoadingSpinner/Loading";

export default function SearchWrapper() {
  return (
    <Suspense
      fallback={
        <Loading></Loading>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
