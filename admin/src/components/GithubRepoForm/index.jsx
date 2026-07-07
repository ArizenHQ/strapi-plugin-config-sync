import React, { useState, useEffect } from 'react';
import { TextInput, Card, Button, Box } from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';

const GithubRepoForm = ({ value, onChange }) => {
  const { get, post } = getFetchClient();
  const [githubRepo, setGithubRepo] = useState(value);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await get('/config-sync/settings');
        if (data.config?.githubRepositoryConfigSync) {
          setGithubRepo(data.config.githubRepositoryConfigSync);
        }
      } catch (error) {
        console.error('Failed to load config-sync settings:', error);
      }
    };

    loadConfig();
  }, [get]);

  const handleSave = async () => {
    try {
      await post('/config-sync/settings', {
        githubRepositoryConfigSync: githubRepo,
      });
      onChange(githubRepo);
    } catch (error) {
      console.error('Failed to update config-sync settings:', error);
    }
  };

  return (
    <Card padding={4} marginBottom={4}>
      <TextInput
        id="githubRepo"
        value={githubRepo}
        onChange={(e) => setGithubRepo(e.target.value)}
        placeholder="git@github.com:ArizenHQ/coinhouse-cms.git"
        label="Github Repository"
      />
      <Box marginTop={2}>
        <Button onClick={handleSave}>Save Configuration</Button>
      </Box>
    </Card>
  );
};

export default GithubRepoForm;
