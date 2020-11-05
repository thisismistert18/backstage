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

import { Entity } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { useEffect, useMemo } from 'react';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../../../plugin';
import { BasicEntry, FilterOptions, FormValues } from '../types';

const DEFAULT_KINDS: BasicEntry[] = [
  { id: 'component', label: 'Component' },
  { id: 'api', label: 'API' },
  { id: 'user', label: 'User' },
  { id: 'group', label: 'Group' },
  { id: 'template', label: 'Template' },
  { id: 'location', label: 'Location' },
];

/*
const DEFAULT_COMPONENT_TYPES: BasicEntry[] = [
  { id: 'service', label: 'Service' },
  { id: 'website', label: 'Website' },
  { id: 'library', label: 'Library' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'other', label: 'Other' },
];
*/

export function idToLabel(id: string) {
  if (id === 'api') {
    return 'API';
  }

  return capitalize(id);
}

export function getFilterOptions(
  formValues: FormValues,
  allEntities: Entity[] | undefined,
  _filteredEntities: Entity[] | undefined,
): FilterOptions {
  // The defaults shall always be present
  const kinds = [...DEFAULT_KINDS];

  // Things that appear in entities shall always be present
  if (allEntities) {
    for (const entity of allEntities) {
      const kind = entity.kind.toLowerCase();
      kinds.push({ id: kind, label: idToLabel(kind) });
    }
  }

  // If a value was selected, it shall be present
  if (formValues.kind) {
    const value = formValues.kind.toLowerCase();
    kinds.push({ id: value, label: idToLabel(value) });
  }

  return {
    kind: sortBy(uniqBy(kinds, 'id'), 'label'),
  };
}

export function useFilterSets(
  formValues: FormValues,
  filteredEntities: Entity[] | undefined,
): FilterOptions {
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);

  // Fetch all entities, which is needed for the core filters whose options
  // are the same independently of all other
  // TODO(freben): Just fetch the few fields we need per entity, when the
  // catalog client supports it
  const { value: allEntities, error } = useAsync(() =>
    catalogApi.getEntities(),
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [errorApi, error]);

  return useMemo(
    () => getFilterOptions(formValues, allEntities, filteredEntities),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(formValues), allEntities, filteredEntities],
  );
}
