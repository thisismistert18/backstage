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

import { useMemo } from 'react';
import { FormValues } from '../types';

/**
 * Decodes the location search parameters once on page mount, and supplies the
 * initial form settings based on that.
 */
export function useDefaultFilterValuesFromLocation(): FormValues {
  return useMemo(() => {
    const search = window.location.search.replace(/^[?]/, '');
    const params = new URLSearchParams(search);

    // eslint-disable-next-line no-console
    console.log('read', params.toString());

    const filter = params.get('filter');
    if (filter) {
      return Object.fromEntries(
        filter
          .split(',')
          .map(x => x.split('='))
          .filter(x => x.length === 2 && x[0] && x[1]),
      );
    }

    return { kind: 'component' };
  }, []);
}
