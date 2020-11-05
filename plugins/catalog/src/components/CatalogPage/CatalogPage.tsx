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

import { Content, ContentHeader, SupportButton } from '@backstage/core';
import { rootRoute as scaffolderRootRoute } from '@backstage/plugin-scaffolder';
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { EntityFilterGroupsProvider } from '../../filter';
import { CatalogTable } from '../CatalogTable/CatalogTable';
import { AddExampleEntitiesButton } from './AddExampleEntitiesButton';
import CatalogLayout from './CatalogLayout';
import { useDefaultFilterValuesFromLocation } from './hooks/useDefaultFilterValuesFromLocation';
import { useFilterSets } from './hooks/useFilterOptions';
import { useFilteredEntities } from './hooks/useFilteredEntities';
import { useSetLocationFromFilterValues } from './hooks/useSetLocationFromFilterValues';
import { WelcomeBanner } from './WelcomeBanner';
import { KindPicker } from './pickers/KindPicker';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

const CatalogPageContents = () => {
  const styles = useStyles();
  const defaultValues = useDefaultFilterValuesFromLocation();
  const { control, watch } = useForm({ defaultValues, mode: 'onChange' });
  const values = watch();
  useSetLocationFromFilterValues(values);
  const { loading, error, value: entities } = useFilteredEntities(values);
  const filterSets = useFilterSets(values, entities);

  return (
    <CatalogLayout>
      <Content>
        <WelcomeBanner />
        <ContentHeader title="">
          <Button
            component={RouterLink}
            variant="contained"
            color="primary"
            to={scaffolderRootRoute.path}
          >
            Create Component
          </Button>
          <AddExampleEntitiesButton catalogIsEmpty={false} onAdded={() => {}} />
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
            >
              <KindPicker control={control} options={filterSets.kind} />
            </form>
          </div>
          <CatalogTable
            titlePreamble="Entities"
            entities={entities || []}
            loading={loading}
            error={error}
          />
        </div>
      </Content>
    </CatalogLayout>
  );
};

export const CatalogPage = () => (
  <EntityFilterGroupsProvider>
    <CatalogPageContents />
  </EntityFilterGroupsProvider>
);
