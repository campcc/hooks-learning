import React, { useState, useEffect } from "react";

type UseRenderCount = () => number;

const useRenderCount: UseRenderCount = () => {
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    setRenderCount((prevCount) => prevCount + 1);
  });

  return renderCount;
};

interface MyComponentProps {
  message: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ message }) => {
  const renderCount = useRenderCount();

  return (
    <div>
      <p>{message}</p>
      <p>Render count: {renderCount}</p>
    </div>
  );
};