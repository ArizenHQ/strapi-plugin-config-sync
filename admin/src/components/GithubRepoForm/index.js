import React, { useState, useEffect } from "react";
import { TextInput, Card, Button, Box } from '@strapi/design-system';
const request = async (url, { method = 'GET', body } = {}) => {
  const token = JSON.parse(sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken') || 'null');
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

const GithubRepoForm = ({ value, onChange }) => {
  const [githubRepo, setGithubRepo] = useState(value);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { config } = await request('/config-sync/settings', {
          method: 'GET',
        });
        if (config.githubRepositoryConfigSync) {
          setGithubRepo(config.githubRepositoryConfigSync);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la configuration:', error);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    try {
      const data = await request('/config-sync/settings', {
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
