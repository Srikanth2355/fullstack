import { useEffect } from "react";
import { useLoading } from "./loader"; // Import your loading context

const LazyLoader = ({ children }) => {
    const { showLoading, hideLoading } = useLoading(); // Get loading functions

    useEffect(() => {
        showLoading(); // Show loading spinner
        return () => hideLoading(); // Hide when component is ready
    }, []);

    return children; // Render the actual component
};

export default LazyLoader;
