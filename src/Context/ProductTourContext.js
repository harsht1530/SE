import React from 'react';

const ProductTourContext = React.createContext({
    run:false,
    setRun:() => {}
})


export const ProductTourProvider = ProductTourContext.Provider;
export const useProductTour = () => React.useContext(ProductTourContext);

export default ProductTourContext;

