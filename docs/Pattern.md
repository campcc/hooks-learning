# Pattern

React 中组件增强有 4 种模式，

- mixin（混合）
- extends（继承）
- HOC（高阶组件）
- 自定义 hooks

## mixin

React 早期的一种增强组件的方式，现在基本已经废弃，不推荐可以作为了解，

```js
import React from "react";

const LoggingMixin = {
  componentDidMount() {
    console.log(`${this.constructor.displayName} mounted`);
  },

  componentWillUnmount() {
    console.log(`${this.constructor.displayName} unmount`);
  },
};

const MyComponent = React.createClass({
  displayName: "MyComponent",

  mixins: [LoggingMixin],

  render() {
    return (
      <div>
        <h1>This is a component</h1>
      </div>
    );
  },
});
```

mixin 存在的问题，

- mixin 中同名的方法或属性存在命名冲突
- 依赖于 React.createClass
- mixin 模式类似于滚雪球，会越滚越大，导致复杂度逐渐累加，难以维护
- 不支持类型检查，对 TypeScript 不友好

## extends

继承模式，React 类本身也是继承，如 React.Component、React.PureComponent，

```tsx
import React, { Component } from "react";

interface BaseComponentProps {
  title: string;
}

interface DerivedComponentProps extends BaseComponentProps {
  content: string;
}

class BaseComponent extends Component<BaseComponentProps> {
  renderTitle() {
    return <h1>{this.props.title}</h1>;
  }

  render() {
    return <div>{this.renderTitle()}</div>;
  }
}

class DerivedComponent extends BaseComponent {
  constructor(props: DerivedComponentProps) {
    super(props);
  }

  renderContent() {
    return <p>{this.props.content}</p>;
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        {this.renderContent()}
      </div>
    );
  }
}
```

## HOC

高阶组件是官方推荐的类组件的增强模式，什么是高阶组件？

如果一个组件接收的参数是一个组件，并且返回也是一个组件，那么这个组件就是高阶组件（HOC）。

以一个简单的记录组件渲染次数的 HOC 为例，

```tsx
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
```

## 自定义 Hooks

Hooks 解决了函数式组件的无状态问题，是目前最主流的组件增强模式，

上面的 HOC 我们也可以使用自定义 hooks 实现，

```tsx
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
```
