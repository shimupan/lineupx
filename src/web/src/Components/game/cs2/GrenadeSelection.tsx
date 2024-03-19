import Decoy from '../../../assets/svg/decoy.svg';
import Smoke from '../../../assets/svg/smoke.svg';
import Molotov from '../../../assets/svg/molotov.svg';
import HE from '../../../assets/svg/he.svg';
import Flash from '../../../assets/svg/flash.svg';

type GrenadeSelectionProps = {
   isMobile: boolean;
   activeButton: string | null;
   setActiveButton: React.Dispatch<React.SetStateAction<string | null>>;
};

const GrenadeSelection: React.FC<GrenadeSelectionProps> = ({
   activeButton,
   setActiveButton,
}) => {
   return (
      <div className="abilities flex flex-row md:flex-row flex-wrap items-center justify-center gap-4 p-4">
         <div className="abilities-horizontal flex flex-row justify-center items-start gap-4">
            {[
               { name: 'Decoy', src: Decoy },
               { name: 'Smoke', src: Smoke },
               { name: 'Molotov', src: Molotov },
               { name: 'HE', src: HE },
               { name: 'Flash', src: Flash },
            ].map((grenade) => (
               <button
                  key={grenade.name}
                  className={`ability bg-1b2838 shadow-lg rounded-full p-2 flex flex-col items-center justify-start w-10 h-10 ${
                     activeButton === grenade.name ? 'bg-black' : ''
                  }`}
                  onClick={() =>
                     setActiveButton(
                        activeButton === grenade.name ? '' : grenade.name,
                     )
                  }
               >
                  <img
                     src={grenade.src}
                     alt={grenade.name}
                     className={`ability-icon w-full h-full ${
                        activeButton === grenade.name ? 'shadow-lg' : ''
                     }`}
                     style={{
                        filter: 'brightness(0) invert(1)',
                     }}
                  />
               </button>
            ))}
         </div>
      </div>
   );
};

export default GrenadeSelection;