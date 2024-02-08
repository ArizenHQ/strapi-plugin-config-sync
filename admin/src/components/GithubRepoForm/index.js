import React, { useState } from "react";
import { TextInput, Card, Button, Box } from '@strapi/design-system';
import { request } from '@strapi/helper-plugin';

const GithubRepoForm = ({ value, onChange }) => {
  const [githubRepo, setGithubRepo] = useState(value);

  const handleSave = async () => {
    try {
      const data = await request('/config-sync/configuration', {
        method: 'POST',
        body: {
          githubRepositoryConfigSync: githubRepo,
        },
      });
      console.log('Configuration mise à jour avec succès:', data);
      onChange(githubRepo);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration:', error);
    }
  };

  return (
    <Card padding={4} marginBottom={4}>
      <TextInput
        id="githubRepo"
        value={githubRepo}
        onChange={(e) => setGithubRepo(e.target.value)}
        placeholder="Enter the GitHub repository URL"
        label="Github Repository"
      />
      <Box marginTop={2}>
        <Button onClick={handleSave}>Save Configuration</Button>
      </Box>
    </Card>
  );
};

export default GithubRepoForm;
