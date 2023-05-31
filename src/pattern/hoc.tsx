import React, { ComponentType, useState, useEffect } from "react";

// 定义一个高阶组件的类型
type WithRenderCountProps = {
  renderCount: number;
};

function withRenderCount<P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithRenderCountProps> {
  return (props: P) => {
    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
      setRenderCount((prevCount) => prevCount + 1);
    });

    return <WrappedComponent {...(props as P)} renderCount={renderCount} />;
  };
}

interface MyComponentProps {
  message: string;
  renderCount: number;
}

const MyComponent: React.FC<MyComponentProps> = ({ message, renderCount }) => {
  return (
    <div>
      <p>{message}</p>
      <p>Render count: {renderCount}</p>
    </div>
  );
};

const EnhancedMyComponent = withRenderCount(MyComponent);

export default EnhancedMyComponent;