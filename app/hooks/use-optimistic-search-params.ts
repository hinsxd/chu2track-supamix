import { useCallback, useState } from "react";

import { useSearchParams } from "@remix-run/react";

export const useOptimisticSearchParams = () => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [localSearchParams, setLocalSearchParams] = useState(urlSearchParams);

  const setSearchParams = useCallback(
    (
      updater:
        | URLSearchParams
        | ((oldSearchParams: URLSearchParams) => URLSearchParams)
    ) => {
      if (!updater) return;
      if (typeof updater === "function") {
        const newSearchParams = updater(localSearchParams);
        setLocalSearchParams(newSearchParams);
        setUrlSearchParams(newSearchParams);
      } else {
        setLocalSearchParams(updater);
        setUrlSearchParams(updater);
      }
    },
    [setUrlSearchParams, localSearchParams]
  );

  return [localSearchParams, setSearchParams] as const;
};
