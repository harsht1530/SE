const HCOProfileShimmer = () => (
    <div className="w-full flex gap-10 p-10 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="rounded-full bg-gray-300 h-[200px] w-[200px]"></div>
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-6 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>
  
      <div className="w-full flex flex-col mt-10 gap-4">
        <div className="h-6 bg-gray-300 w-1/2 rounded"></div>
        <div className="h-[1px] bg-gray-300 w-full"></div>
        <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
  
        <div className="flex gap-6 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-32 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
  



const HCOShimmerEffect = ({type}) => {
    switch(type){
        case "HCOProfile":
            return <HCOProfileShimmer />;

    }
}

export default HCOShimmerEffect;
