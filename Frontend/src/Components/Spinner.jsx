import React from "react";
import { useLoader } from "../Context/LoaderContext";

const Spinner = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
</div>
  );
};

export default Spinner;
