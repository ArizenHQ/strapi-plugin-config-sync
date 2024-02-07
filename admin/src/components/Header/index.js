/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import { HeaderLayout, Box } from '@strapi/design-system';

const HeaderComponent = () => {
  const { formatMessage } = useIntl();

  return (
    <Box background="neutral100">
      <HeaderLayout
        title={formatMessage({ id: 'config-sync.Header.Title', defaultMessage: "Config Sync" })}
        subtitle={formatMessage({ id: 'config-sync.Header.Description', defaultMessage: "Manage your database config across environments." })}
        as="h2"
      />
    </Box>
  );
};

export default memo(HeaderComponent);
