import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  Dialog,
  Flex,
  Typography,
  Button,
  Checkbox,
  Divider,
  Box,
  Field,
} from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';

const ConfirmModal = ({ onSubmit, type, trigger }) => {
  const soft = useSelector((state) => state.getIn(['config', 'appEnv', 'config', 'soft'], false));
  const [force, setForce] = useState(false);
  const { formatMessage } = useIntl();

  const getButtonMessage = () => {
    switch (type) {
      case 'import':
        return 'Yes, import';
      case 'export':
        return 'Yes, export';
      case 'deploy-production':
        return 'Yes, Create Pull Request';
      default:
        return 'Confirm';
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {formatMessage({ id: 'config-sync.popUpWarning.Confirmation', defaultMessage: 'Confirmation' })}
        </Dialog.Header>
        <Dialog.Body>
          <WarningCircle fill="danger600" width="32px" height="32px" />
          <Flex size={2}>
            <Flex justifyContent="center">
              <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
                {type === 'deploy-production' ? (
                  <>
                    {formatMessage({ id: 'config-sync.popUpWarning.warning.deploy_1', defaultMessage: 'Deploying to production will apply all configuration changes' })}<br />
                    {formatMessage({ id: 'config-sync.popUpWarning.warning.deploy_2', defaultMessage: 'and cannot be undone. Are you sure you want to continue?' })}
                  </>
                ) : (
                  <>
                    {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_1`, defaultMessage: 'If you continue all your local config files' })}<br />
                    {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_2`, defaultMessage: type === 'export' ? 'will be written into config files.' : 'will be imported into the database.' })}
                  </>
                )}
              </Typography>
            </Flex>
          </Flex>
          {(soft && type === 'import') && (
            <Box width="100%">
              <Divider marginTop={4} />
              <Box paddingTop={6}>
                <Field.Root hint="Check this to ignore the soft setting.">
                  <Checkbox
                    onValueChange={(value) => setForce(value)}
                    value={force}
                    name="force"
                  >
                    {formatMessage({ id: 'config-sync.popUpWarning.force', defaultMessage: 'Force' })}
                  </Checkbox>
                  <Field.Hint />
                </Field.Root>
              </Box>
            </Box>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button fullWidth variant="tertiary">
              {formatMessage({ id: 'config-sync.popUpWarning.button.cancel', defaultMessage: 'Cancel' })}
            </Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                onSubmit(force);
              }}
            >
              {formatMessage({ id: `config-sync.popUpWarning.button.${type}`, defaultMessage: getButtonMessage() })}
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ConfirmModal;
