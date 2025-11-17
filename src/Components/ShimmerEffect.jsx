import React from 'react'

const GeneralShimmerEffect = () => {
    return (
        <div className="animate-pulse space-y-4 p-4">
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            <div className='space-y-3'>
                <div className='h-4 bg-gray-200 rounded'></div>
                <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                <div className='h-4 bg-gray-200 rounded w-4/6'></div>

            </div>
        </div>
    )
}

const PublicationShimmerEffect = () => {
    return (
        <div>
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md mb-6 p-4">
                    <div className="flex gap-4">
                        {/* Left badge */}
                        <div className="h-32 w-24 bg-gray-200 rounded-md p-2 flex flex-col justify-between">
                            <div className="h-6 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>

                        {/* Right content */}
                        <div className="flex-1">
                            {/* Title */}
                            <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>

                            {/* Abstract */}
                            <div className="space-y-2 mb-4">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            </div>

                            {/* Link */}
                            <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>

                            {/* Date */}
                            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>

                            {/* Authors */}
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4].map((author) => (
                                    <div key={author} className="flex items-center gap-2 border border-gray-200 rounded-md p-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ClinicalTrialsShimmerEffect = () => {
    return (
        <>
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="animate-pulse py-6">
                    <div className="flex justify-between gap-4 items-center p-4 rounded-lg shadow-md my-4">
                        <div className="mt-2 flex flex-col gap-4 w-[90%]">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                        <button className="flex items-center gap-2 mt-4 px-2 py-1 bg-gray-200 rounded h-8 w-20"></button>
                    </div>
                </div>
            ))}
        </>
    );
};


const CongressShimmerEffect = () => {
    return (
      <>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <div key={index} className="flex-1 border border-gray-200 rounded-md p-5 ml-10 mr-10 max-h-[80vh] overflow-y-auto animate-pulse rounded">
            <div className="mb-8 p-4 border-b border-gray-200 last:border-b-0"> 
              <div className="flex items-start">
                <div className="text-center w-1/8 mr-4 border border-gray-200">
                  <div className="bg-gray-200 rounded h-10"></div>
                  <div className="bg-gray-100 rounded h-3 mt-2"></div>
                  <div className="bg-gray-100 rounded h-3 mt-2"></div>
                </div>
                <div className="flex-1 w-7/8">
                  <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                  <div className="bg-gray-200 rounded h-3 mt-2 w-5/6"></div>
                  <div className="mt-2">
                    <div><span className="bg-gray-200 rounded h-3 w-1/3 inline-block"></span></div>
                    <div><span className="bg-gray-200 rounded h-3 w-1/4 inline-block mt-2"></span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

const ProfilesListShimmer = () => {
    return (
        <>
       
       
      <div className='flex flex-col gap-4 w-[calc(100%-400px)]'>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0 mx-auto animate-pulse">
            <div className="flex items-center gap-2 p-5">
              {/* Checkbox shimmer */}
              <div className="w-4 h-4 bg-gray-300 rounded mr-2" />
  
              {/* Profile image shimmer */}
              <div className="w-[60px] h-[60px] bg-gray-300 rounded-full" />
  
              {/* Text shimmer */}
              <div className="flex flex-col space-y-2 flex-1">
              <div className="h-40 w-2/3 bg-gray-300 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-300 rounded animate-pulse" />
            </div>
            </div>
          </div>
        ))}
      </div>
    
      </>
    );
};
  
  

  const ProfileShimmer = () => (
    <div className="w-full flex items-center gap-10 p-10 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="rounded-full bg-gray-300 h-48 w-48" />
        <div className="bg-gray-300 h-6 w-32 mx-auto rounded" />
      </div>
  
      <div className="flex-1 gap-2 mr-10">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <div className="bg-gray-300 h-6 w-40 rounded" />
            <div className="bg-gray-300 h-4 w-64 rounded" />
          </div>
          <div className="h-10 w-48 bg-gray-300 rounded-md" />
        </div>
  
        <hr className="my-4" />
  
        <div className="space-y-2">
          <div className="bg-gray-300 h-4 w-40 rounded" />
          <div className="bg-gray-300 h-4 w-56 rounded" />
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-gray-300 h-5 w-5 rounded-full" />
            <div className="bg-gray-300 h-4 w-64 rounded" />
          </div>
          <div className="flex gap-6 mt-3">
            <div className="bg-gray-300 h-4 w-40 rounded" />
            <div className="bg-gray-300 h-4 w-32 rounded" />
            <div className="bg-gray-300 h-4 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
  
  const VideoCardShimmer = () => {
    return(
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 items-start my-8'>
        {[1,2,3,4,5,6].map((item) => (
             <div key={item} className="flex flex-col items-center p-6 bg-gray-50">
             <div className="w-[400px] animate-pulse">
               <div className="w-full h-[210px] bg-gray-300 rounded-md" />
     
               <div className="pt-4 space-y-2">
                 <div className="h-4 bg-gray-300 rounded w-3/4" />
                 <div className="h-3 bg-gray-300 rounded w-1/2" />
     
                 <div className="flex items-center gap-8 pt-2">
                   <div className="h-3 bg-gray-300 rounded w-20" />
                   <div className="h-3 bg-gray-300 rounded w-20" />
                 </div>
               </div>
             </div>
             </div> 
       
        ))}
        </div>
    )
    
};

const ScientificItemShimmer = () => {
    return (
      <div className="hover:bg-gray-50 animate-pulse">
        <div className="flex items-start gap-4">
          {/* Left section with placeholder box and date */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-300 w-24 h-24 rounded-lg" />
            <div className="mt-2 h-4 bg-gray-300 w-16 rounded" />
          </div>
  
          {/* Right section with title, link, coauthors */}
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3" />
  
            {/* Fake coauthors */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-md p-2 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <div className="h-3 bg-gray-300 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShimmerProfileCard = () => {
    return (
        <div >
      {[1,2,3].map((item) => (
            <div className="border-b border-gray-200 px-5 py-4 animate-pulse">
            <div className="flex items-center gap-4">
              {/* <div className="w-4 h-4 rounded-md bg-gray-300" /> */}
              <div className="w-20 h-18 rounded-full bg-gray-300" />
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
            </div>

      )
    )}
        </div>
    );
  };

  const ClinicalTrialsDataById = () =>{
     return(
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4 box-border relative animate-pulse w-full h-full">
    <div className="flex justify-between items-center pb-4 sticky top-0 bg-white z-10 w-full">
      <div className="h-6 w-40 bg-gray-300 rounded" />
      <div className="h-8 w-8 bg-gray-300 rounded-full" />
    </div>
    <div className="bg-white mb-4 rounded-lg w-full h-[calc(100%-50px)] p-1 md:p-6 lg:p-6 overflow-y-auto">
      <div className="py-2 border-b border-gray-300">
        <div className="h-6 w-2/3 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
      <div className="mt-4">
        <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-gray-300 py-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div>
          <div className="h-5 w-40 bg-gray-300 rounded mb-2" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
          ))}
        </div>
        <div className="border-t border-gray-300 mt-2">
          <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
          ))}
        </div>
      </div>
      <div className="mt-4 mb-10">
        <div className="h-5 w-48 bg-gray-300 rounded mb-2" />
        <div className="border-t border-gray-300 py-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
          ))}
        </div>
      </div>
    </div>
  </div>
        
     )
  }  
  

const ShimmerEffect = ({ type = "publication" }) => {
    switch (type) {
        case "publication":
            return <PublicationShimmerEffect />
        case "clinical":
            return <ClinicalTrialsShimmerEffect />
        case "congress":
            return <CongressShimmerEffect />
        case "people":
            return <ProfilesListShimmer />
        case "profile":
            return <ProfileShimmer />
        case "video":
            return <VideoCardShimmer />
        case "scientificItem":
            return <ScientificItemShimmer />
        case "profileCard":
            return <ShimmerProfileCard />
        case "clinicalTrialsDataById":
            return <ClinicalTrialsDataById />
        default:
            return <GeneralShimmerEffect />

    }
}

export default ShimmerEffect