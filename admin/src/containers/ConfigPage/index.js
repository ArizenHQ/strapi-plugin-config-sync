import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Map } from "immutable";
import { Box, ContentLayout, Alert, Typography } from "@strapi/design-system";
import { useNotification } from "@strapi/helper-plugin";

import { getAllConfigDiff, getAppEnv } from "../../state/actions/Config";
import ConfigList from "../../components/ConfigList";
import ActionButtons from "../../components/ActionButtons";
import GithubRepoForm from "../../components/GithubRepoForm";

const ConfigPage = () => {
  const toggleNotification = useNotification();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.getIn(["config", "isLoading"], Map({})));
  const configDiff = useSelector((state) => state.getIn(["config", "configDiff"], Map({})));
  const appEnv = useSelector((state) => state.getIn(["config", "appEnv", "env"]));
  const [githubRepo, setGithubRepo] = useState("");

  const handleGithubRepoChange = (value) => {
    setGithubRepo(value);
  };

  useEffect(() => {
    dispatch(getAllConfigDiff(toggleNotification));
    dispatch(getAppEnv(toggleNotification));
  }, []);

  return (
    <ContentLayout paddingBottom={8}>
      <GithubRepoForm value={githubRepo} onChange={handleGithubRepoChange} />
      {appEnv === "production" && (
        <Box paddingBottom={4}>
          <Alert variant="danger">
            <Typography variant="omega" fontWeight="bold">
              You&apos;re in the production environment
            </Typography>
            <br />
            Please be careful when syncing your config in production.
            <br />
            Make sure you are not overriding critical config changes on import.
          </Alert>
        </Box>
      )}
      <ActionButtons />
      <ConfigList isLoading={isLoading} diff={configDiff.toJS()} />
    </ContentLayout>
  );
};

export default ConfigPage;
