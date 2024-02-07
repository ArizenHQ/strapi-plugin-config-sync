import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button } from '@strapi/design-system';
import { Map } from 'immutable';
import { useNotification } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';

import ConfirmModal from '../ConfirmModal';
import { exportAllConfig, importAllConfig, deployProductionConfig } from '../../state/actions/Config';

const ActionButtons = () => {
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const partialDiff = useSelector((state) => state.getIn(['config', 'partialDiff'], Map({}))).toJS();
  const { formatMessage } = useIntl();

  const closeModal = () => {
    setActionType('');
    setModalIsOpen(false);
  };

  const openModal = (type) => {
    setActionType(type);
    setModalIsOpen(true);
  };

  return (
    <ActionButtonsStyling>
      <Button disabled={isEmpty(partialDiff)} onClick={() => openModal('import')}>
        {formatMessage({ id: 'config-sync.Buttons.Import', defaultMessage: 'Import' })}
      </Button>
      <Button disabled={isEmpty(partialDiff)} onClick={() => openModal('export')}>
        {formatMessage({ id: 'config-sync.Buttons.Export', defaultMessage: 'Export' })}
      </Button>
      <Button disabled={isEmpty(partialDiff)} onClick={() => openModal('deploy-production')}>
        {formatMessage({ id: 'config-sync.Buttons.DeployProduction', defaultMessage: 'Deploy to production' })}
      </Button>
      {!isEmpty(partialDiff) && (
        <h4 style={{ display: 'inline' }}>{Object.keys(partialDiff).length} {Object.keys(partialDiff).length === 1 ? "config change" : "config changes"}</h4>
      )}
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        type={actionType}
        onSubmit={(force) => {
          switch (actionType) {
            case 'import':
              dispatch(importAllConfig(partialDiff, force, toggleNotification));
              break;
            case 'export':
              dispatch(exportAllConfig(partialDiff, toggleNotification));
              break;
            case 'deploy-production':
              dispatch(deployProductionConfig(partialDiff, toggleNotification));
              break;
            default:
              console.error(`Type d'action non reconnu: ${actionType}`);
          }
        }}
      />
    </ActionButtonsStyling>
  );
};

const ActionButtonsStyling = styled.div`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: center;

  > button {
    margin-right: 10px;
  }
`;

export default ActionButtons;
