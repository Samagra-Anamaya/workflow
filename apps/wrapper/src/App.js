import React, { useState, useEffect } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";

import GenericForm from './components/GenericForm';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(sessionStorage.getItem('theme')) ?? true
  );

  useEffect(() => {
    sessionStorage.setItem('theme', JSON.stringify(isDarkMode));
    console.log(isDarkMode)
  }, [isDarkMode]);

  const [flows, setFlows] = useState([
    {
      name: 'Jumping Forms',
      config: 'workflow_first.json',
      submitToHasura: false
    },
    {
      name: 'Hasura Submissions',
      config: 'workflow_second.json',
      submitToHasura: true
    },
    {
      name: 'Offline Capabilities',
      config: 'workflow_first.json',
      offline: true
    },
    {
      name: 'File Upload',
      config: 'workflow_first.json'
    }
  ]);

  const [selectedFlow, setSelectedFlow] = useState({});

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="toggleButtonContainer">
        <span className='toggle-btn' onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? (
            <i class="fa-solid fa-sun"></i>
          ) : (
            <i class="fa-solid fa-moon"></i>
          )}
        </span>
      </div>
      <div className='container'>
        {!Object.keys(selectedFlow).length ? (
          <>
            <div className='heading animate__animated animate__fadeInDown'>Workflow Demo App</div>
            <div className='subtitle animate__animated animate__fadeInDown'>Please select one of the flows</div>
            <div className='btnContainer'>
              {flows?.map(el => (
                <div
                  className='workflowBtns animate__animated animate__fadeIn'
                  onClick={() => setSelectedFlow(el)}
                  key={el.name}
                >
                  {el.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <GenericForm {...{ selectedFlow, setSelectedFlow}} />
        )}
      </div>
    </div>
  );
}

export default App;
