import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Button, Typography } from '@strapi/design-system';
import { Map } from 'immutable';
import { getFetchClient, useNotification } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';

import ConfirmModal from '../ConfirmModal';
import { exportAllConfig, importAllConfig, downloadZip, deployProductionConfig } from '../../state/actions/Config';

const ActionButtons = () => {
  const { post, get } = getFetchClient();
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const partialDiff = useSelector((state) => state.getIn(['config', 'partialDiff'], Map({}))).toJS();
  const { formatMessage } = useIntl();

  return (
    <ActionButtonsStyling>
      <ConfirmModal
        type="import"
        trigger={(
          <Button disabled={isEmpty(partialDiff)}>
            {formatMessage({ id: 'config-sync.Buttons.Import', defaultMessage: 'Import' })}
          </Button>
        )}
        onSubmit={(force) => dispatch(importAllConfig(partialDiff, force, toggleNotification, formatMessage, post, get))}
      />
      <ConfirmModal
        type="export"
        trigger={(
          <Button disabled={isEmpty(partialDiff)}>
            {formatMessage({ id: 'config-sync.Buttons.Export', defaultMessage: 'Export' })}
          </Button>
        )}
        onSubmit={() => dispatch(exportAllConfig(partialDiff, toggleNotification, formatMessage, post, get))}
      />
      <ConfirmModal
        type="deploy-production"
        trigger={(
          <Button disabled={!isEmpty(partialDiff)}>
            {formatMessage({ id: 'config-sync.Buttons.DeployProduction', defaultMessage: 'Create Pull Request' })}
          </Button>
        )}
        onSubmit={() => dispatch(deployProductionConfig(toggleNotification, formatMessage, post))}
      />
      {!isEmpty(partialDiff) && (
        <Typography variant="epsilon">{Object.keys(partialDiff).length} {Object.keys(partialDiff).length === 1 ? 'config change' : 'config changes'}</Typography>
      )}
      <Button onClick={() => dispatch(downloadZip(toggleNotification, formatMessage, post, get))}>
        {formatMessage({ id: 'config-sync.Buttons.DownloadConfig', defaultMessage: 'Download Config' })}
      </Button>
    </ActionButtonsStyling>
  );
};

const ActionButtonsStyling = styled.div`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  > button:last-of-type {
    margin-left: auto;
  }
`;

export default ActionButtons;
