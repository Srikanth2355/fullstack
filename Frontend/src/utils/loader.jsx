import React, {useState, createContext, useContext} from 'react';
import { Spin } from 'antd';

const LoadingContext = createContext({
    isLoading: false,
    showloader: () => {},
    hideloader: () => {}
});

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
  
    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);
    const value = { isLoading, showLoading, hideLoading }
  
    return (
      <LoadingContext.Provider value={ value }>
        {children}
        {/* Render the loader conditionally */}
        {isLoading && (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }} className="fixed top-0 left-0 w-full h-full  z-50 flex items-center justify-center"> {/* Overlay */}
            <Spin size="large" /> {/* Your loader component */}
          </div>
        )}
      </LoadingContext.Provider>
    );
  };

  export const useLoading = () => useContext(LoadingContext);