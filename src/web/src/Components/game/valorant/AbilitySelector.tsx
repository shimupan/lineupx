import React from 'react';
import { ValorantAgent } from '../../../global.types';

type AbilitySelectorProps = {
  agent: ValorantAgent['data'][0] | null;
  selectedAbility: ValorantAgent['data'][0]['abilities'][0] | null | undefined;
  onAbilityClick: (ability: ValorantAgent['data'][0]['abilities'][0]) => void;
};

const AbilitySelector: React.FC<AbilitySelectorProps> = ({
  agent,
  selectedAbility,
  onAbilityClick
}) => {
  if (!agent) return null;

  return (
    <div className="abilities flex flex-row md:flex-row flex-wrap items-center justify-center gap-4 p-4">
      <div className="abilities-horizontal flex flex-row justify-center items-start gap-4">
        {agent.abilities.map(
          (ability, index) =>
            ability.slot !== 'Passive' && (
              <button
                key={index}
                className={`ability bg-1b2838 shadow-lg rounded-full p-2 flex flex-col items-center justify-start w-10 h-10 ${
                  selectedAbility === ability ? 'bg-black' : ''
                }`}
                onClick={() => onAbilityClick(ability)}
              >
                <img
                  src={ability.displayIcon}
                  alt={ability.displayName}
                  className={`ability-icon w-full h-full ${
                    selectedAbility === ability ? 'shadow-lg' : ''
                  }`}
                  style={{
                    filter: selectedAbility === ability ? 'grayscale(100%)' : 'none',
                  }}
                />
              </button>
            )
        )}
      </div>
    </div>
  );
};

export default AbilitySelector;