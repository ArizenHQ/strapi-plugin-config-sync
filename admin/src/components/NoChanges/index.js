import React from 'react';
import { NoContent } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';

const NoChanges = () => {
  const { formatMessage } = useIntl();
  return (
    <NoContent
      content={{
        id: 'emptyState',
        defaultMessage: formatMessage({ id: 'config-sync.NoChanges.Message', defaultMessage: "No differences between DB and sync directory. You are up-to-date!" }),
      }}
    />
  );
};

export default NoChanges;
