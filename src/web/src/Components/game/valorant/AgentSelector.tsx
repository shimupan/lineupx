import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ValorantAgent } from '../../../global.types';

type AgentSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  agents: ValorantAgent['data'];
  currentMapName: string;
  onAgentSelect: (agent: ValorantAgent['data'][0]) => void;
};

const AgentSelector: React.FC<AgentSelectorProps> = ({
  isOpen,
  onClose,
  agents,
  onAgentSelect
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agent Selector"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
        },
        content: {
          width: isMobile ? '70%' : '30%',
          height: isMobile ? '30%' : '30%',
          margin: 'auto',
          backgroundColor: '#1f2937',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '1.5rem',
        },
      }}
    >
      <div className="grid grid-cols-5 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.displayName}
            className="flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => onAgentSelect(agent)}
          >
            <img
              src={agent.displayIcon}
              alt={agent.displayName}
              className="w-8 h-8 mb-1"
            />
            {!isMobile && (
              <p className="text-xs text-white text-center">
                {agent.displayName}
              </p>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AgentSelector;