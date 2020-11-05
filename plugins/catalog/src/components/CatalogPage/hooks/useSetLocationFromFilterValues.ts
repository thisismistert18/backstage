/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormValues } from '../types';

export function getFilterString(formValues: FormValues): string | undefined {
  const kind = formValues.kind?.toLowerCase();
  if (kind) {
    return `kind=${kind}`;
  }
  return undefined;
}

/**
 * Creates a setter function, that updates the location query parameters based
 * on the current form values.
 *
 * @param formValues The current form values
 */
export function useSetLocationFromFilterValues(formValues: FormValues): void {
  const navigate = useNavigate();
  const filterString = getFilterString(formValues);

  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('write', filterString);
      const search = new URLSearchParams();
      if (filterString) {
        search.set('filter', filterString);
      }
      navigate(`.?${search.toString()}`, { replace: true });
    } catch {
      // Ignore
    }
  }, [navigate, filterString]);
}
