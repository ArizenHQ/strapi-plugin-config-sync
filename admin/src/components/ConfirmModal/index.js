import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Stack,
  Button,
  Checkbox,
  Divider,
  Box,
} from '@strapi/design-system';
import { ExclamationMarkCircle } from '@strapi/icons';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
  const soft = useSelector((state) => state.getIn(['config', 'appEnv', 'config', 'soft'], false));
  const [force, setForce] = useState(false);
  const { formatMessage } = useIntl();

  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      title={formatMessage({ id: "config-sync.popUpWarning.Confirmation", defaultMessage: "Confirmation" })}
      isOpen={isOpen}
    >
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack size={2}>
          <Flex justifyContent="center">
            <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
              {type === 'deploy-production' ? (
                <>
                  {formatMessage({ id: `config-sync.popUpWarning.warning.deploy_1`, defaultMessage: "Deploying to production will apply all configuration changes" })}<br />
                  {formatMessage({ id: `config-sync.popUpWarning.warning.deploy_2`, defaultMessage: "and cannot be undone. Are you sure you want to continue?" })}
                </>
              ) : (
                <>
                  {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_1`, defaultMessage: "If you continue all your local config files" })}<br />
                  {formatMessage({ id: `config-sync.popUpWarning.warning.${type}_2`, defaultMessage: "will be imported into the database." })}
                </>
              )}
            </Typography>
          </Flex>
        </Stack>
      </DialogBody>
      {(soft && type === 'import') && (
        <React.Fragment>
          <Divider />
          <Box padding={4}>
            <Checkbox
              onValueChange={(value) => setForce(value)}
              value={force}
              name="force"
              hint="Check this to ignore the soft setting."
            >
              {formatMessage({ id: 'config-sync.popUpWarning.force', defaultMessage: "Force" })}
            </Checkbox>
          </Box>
        </React.Fragment>
      )}
      <DialogFooter
        startAction={(
          <Button
            onClick={() => {
              onClose();
            }}
            variant="tertiary"
          >
            {formatMessage({ id: 'config-sync.popUpWarning.button.cancel', defaultMessage: "Cancel" })}
          </Button>
        )}
        endAction={(
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              onSubmit(force);
            }}
          >
            {formatMessage({ id: `config-sync.popUpWarning.button.${type}`, defaultMessage: type === 'import' ? "Yes, import" : "Yes, export" })}
          </Button>
        )} />
    </Dialog>
  );
};

export default ConfirmModal;
