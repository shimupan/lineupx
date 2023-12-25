const PanelCard: React.FC = () => {
    return (
       <>
          <div>
             <div className="mx-auto w-full max-w-lg rounded-lg bg-white px-10 py-8 shadow-xl">
                <div className="mx-auto space-y-6">
                   <a
                      className="block w-full transform rounded-md bg-teal-400 px-4 py-2 text-center font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-teal-500 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80"
                   >
                      Go Back to Tailwind Components
                   </a>
                </div>
             </div>
          </div>
       </>
    );
};

export default PanelCard;