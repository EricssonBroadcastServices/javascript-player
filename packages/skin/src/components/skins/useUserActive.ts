// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import { useCallback, useEffect, useRef, useState } from "preact/hooks";

export function useUserActive({
  userActiveTimeout,
}: {
  userActiveTimeout: number;
}): [boolean, () => void, () => void] {
  const [isUserActive, setIsUserActive] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const triggerUserActive = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setIsUserActive(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsUserActive(false);
    }, userActiveTimeout);
  }, [userActiveTimeout]);

  const toggleUserActive = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setIsUserActive(!isUserActive);
  }, [isUserActive]);

  return [isUserActive, triggerUserActive, toggleUserActive];
}
