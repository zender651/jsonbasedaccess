

import React, { useState } from 'react';

const generateJSONConfig = (role, catalogs) => {
  const rolesConfig = {
    admin: {
      privileges: ["read", "write", "delete", "update"],
      role: [`${role}`],
    },
    ceo: {
      privileges: ["read", "write", "delete", "update"],
      role: [`${role}`],
    },
    manager: {
      privileges: ["read", "update"],
      role: [`${role}`],
    },
    employee: {
      privileges: ["read"],
      role: ["other_users_data"],
    },
    user: {
      privileges: ["read"],
      role: [`${role}`],
    },
  };

  if (!rolesConfig.hasOwnProperty(role)) {
    return {
      error: "Invalid role specified",
    };
  }

  const accessConfig = {
    
     tables: rolesConfig[role],
    catalogs: [],
  };

  catalogs.forEach((catalogRule) => {
    if (catalogRule.role && catalogRule.role === role) {
      accessConfig.catalogs.push({
        catalog: catalogRule.catalog,
        allow: catalogRule.allow,
      });
    }
  });

  return accessConfig;
};

const App = () => {
  const [username, setUsername] = useState('');
  const [generatedJSON, setGeneratedJSON] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const generateJSON = () => {
    const domain = username.split('@')[1];
    let role = 'user';

    if (domain === 'ceo.com') {
      role = 'ceo';
    } else if (domain === 'mgr.com') {
      role = 'manager';
    } else if (domain === 'empl.com') {
      role = 'employee';
    }

    const catalogs = [
      {
        role: 'ceo',
        catalog: '(mysql|system)',
        allow: 'all',
      },
      {
        role: 'manager',
        catalog: 'employee',
        allow: ['read', 'write'],
      },
      {
        role: 'employee',
        catalog: 'user',
        allow: 'all',
      },
      {
        role: 'user',
        catalog: 'owndata',
        allow: 'read',
      },
    ];

    const jsonConfig = generateJSONConfig(role, catalogs);
    setGeneratedJSON(JSON.stringify(jsonConfig, null, 2));
  };

  return (
    <div>
      <h1>Role Access JSON Generator</h1>
      <div>
        <label>Enter Username: </label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <button onClick={generateJSON}>Generate JSON</button>
      </div>
      <div>
        <h2>Generated JSON:</h2>
        <pre>{generatedJSON}</pre>
      </div>
    </div>
  );
};

export default App;
