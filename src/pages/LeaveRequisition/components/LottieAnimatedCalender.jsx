
// import React from 'react';
// import Lottie from 'react-lottie';
// import CalenderAnimation from "../../../assets/CalenderAnimation2.json";

// const LottieAnimatedCalender = () => {
//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: CalenderAnimation,
//   };

//   return <Lottie options={defaultOptions} height={600} width={600} />;
// };

// export default LottieAnimatedCalender ;



import React from 'react';
import Lottie from 'react-lottie';
import CalenderAnimation from '../../../assets/CalenderAnimation2.json'; 

const LottieAnimatedCalender = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: CalenderAnimation,
  };

  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <Lottie options={defaultOptions} height={400} width={500} />
      </div>
    </div>
  );
};

export default LottieAnimatedCalender;
