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

const GrenadeSelection: React.FC<GrenadeSelectionProps> = ({isMobile, activeButton, setActiveButton }) => {
   return (
      <div className="flex flex-row sm:flex-col">
         <button
            onClick={() =>
               setActiveButton(activeButton === 'Decoy' ? '' : 'Decoy')
            }
         >
            <img
               src={Decoy}
               alt="Decoy"
               style={{
                  width: isMobile ? '96px' : '70px',
                  height: isMobile ? '96px' : '70px',
                  opacity: activeButton === 'Decoy' ? 1 : 0.5,
                  filter: activeButton === 'Decoy' ? 'invert(1)' : 'none',
               }}
            />
            <p>Decoy</p>
         </button>
         <button
            onClick={() =>
               setActiveButton(activeButton === 'Smoke' ? '' : 'Smoke')
            }
         >
            <img
               src={Smoke}
               alt="Smoke"
               style={{
                  width: isMobile ? '96px' : '70px',
                  height: isMobile ? '96px' : '70px',
                  opacity: activeButton === 'Smoke' ? 1 : 0.5,
                  filter: activeButton === 'Smoke' ? 'invert(1)' : 'none',
               }}
            />
            <p>Smoke</p>
         </button>
         <button
            onClick={() =>
               setActiveButton(activeButton === 'Molotov' ? '' : 'Molotov')
            }
         >
            <img
               src={Molotov}
               alt="Molotov"
               style={{
                  width: isMobile ? '96px' : '70px',
                  height: isMobile ? '96px' : '70px',
                  opacity: activeButton === 'Molotov' ? 1 : 0.5,
                  filter: activeButton === 'Molotov' ? 'invert(1)' : 'none',
               }}
            />
            <p>Molotov</p>
         </button>
         <button
            onClick={() => setActiveButton(activeButton === 'HE' ? '' : 'HE')}
         >
            <img
               src={HE}
               alt="HE"
               style={{
                  width: isMobile ? '96px' : '70px',
                  height: isMobile ? '96px' : '70px',
                  opacity: activeButton === 'HE' ? 1 : 0.5,
                  filter: activeButton === 'HE' ? 'invert(1)' : 'none',
               }}
            />
            <p>Smoke</p>
         </button>
         <button
            onClick={() =>
               setActiveButton(activeButton === 'Flash' ? '' : 'Flash')
            }
         >
            <img
               src={Flash}
               alt="Flash"
               style={{
                  width: isMobile ? '96px' : '70px',
                  height: isMobile ? '96px' : '70px',
                  opacity: activeButton === 'Flash' ? 1 : 0.5,
                  filter: activeButton === 'Flash' ? 'invert(1)' : 'none',
               }}
            />
            <p>Flash</p>
         </button>
      </div>
   );
};

export default GrenadeSelection;
