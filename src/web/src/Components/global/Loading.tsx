const Loading: React.FC = () => {
   return (
      <>
         <div className="h-screen flex items-center justify-center text-center">
            <div className="bg-gray-100 rounded-lg shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
               <div className="mb-4">
                  <div
                     className="h-1 w-full bg-blue-200"
                     style={{
                        background:
                           'linear-gradient(to right, #7928CA, #FF0080)',
                     }}
                  ></div>
                  <div className="flex flex-col items-center justify-center mt-2">
                     <h5 className="text-gray-900 font-bold text-xl">
                        Loading...
                     </h5>
                     <p className="text-gray-600">
                        Please wait, we are checking if the user exists.
                     </p>
                  </div>
               </div>
               <div className="flex justify-center pb-3">
                  <div
                     className="h-2 w-16 bg-blue-200 rounded-full"
                     style={{
                        background:
                           'linear-gradient(to right, #7928CA, #FF0080)',
                     }}
                  ></div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Loading;
