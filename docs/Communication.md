# Communication

React 中组件间的通信方式一共有 5 种，

- props 和 callback
- context（跨层级）
- event bus 事件总线
- ref 传递
- 状态管理（如：redux、mobx 等）

## props & callback

场景：父传子、子传父

父传子，通过 `props` 传递，

```tsx
import React, { useState } from "react";

function Parent(): React.FC {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <Child count={count}>Children</Child>
    </>
  );
}

function Child(props): React.FC {
  const { count, children } = props;

  return (
    <>
      <div>Received props from parent: {count}</div>
      <div>Received children from parent: {children}</div>
    </>
  );
}
```

子传父，通过 `callback` 传递，

```tsx
import React, { useState } from "react";

function Parent(): React.FC {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div>Received from child: {count}</div>
      <Child updateCount={(value: number) => setCount(value)} />
    </>
  );
}

function Child(props): React.FC {
  const { updateCount } = props;
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <button
        onClick={() => {
          const newCount: number = count + 1;
          setCount(newCount);
          updateCount(newCount);
        }}
      >
        Add
      </button>
    </div>
  );
}
```

## Context

场景：祖代组件向后代组件跨层级传值，主题、国际化等

实现：`Context + Provider + Consumer`

以经典的主题切换应用场景为例，

```tsx
import React, { useState, useContext } from "react";

enum Theme {
  Light,
  Dark,
}

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>(null);

function ThemeProvider(props): React.FC {
  const { children } = props;
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  const toggle = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function App(): React.FC {
  const context = useContext(ThemeContext);
  const { theme, toggle } = context;

  return (
    <ThemeProvider>
      <div>
        <p>Current theme: {theme === Theme.Light ? "light" : "dark"}</p>
        <button onClick={toggle}>toggle theme</button>
      </div>
    </ThemeProvider>
  );
}
```

## Event Bus

事件总线本质就是发布订阅，我们可以自己实现一个发布订阅器来实现跨组件通信，

```ts
type Callback = (...args: any[]) => void;

class EventBus {
  private events: Map<string, Callback[]>;

  constructor() {
    this.events = new Map();
  }

  on(eventName: string, callback: Callback): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  off(eventName: string, callback: Callback): void {
    if (this.events.has(eventName)) {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(eventName: string, ...args: any[]): void {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach((callback) => {
        callback(...args);
      });
    }
  }
}
```

## ref

场景：父组件获取子组件的值

以获取 input 元素的输入值为例，

```tsx
import React, { useRef, useState } from "react";

interface ChildProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

const Child: React.FC<ChildProps> = ({ inputRef }) => {
  return <input ref={inputRef} />;
};

const Parent: React.FC = () => {
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      setText(inputRef.current.value);
    }
  };

  return (
    <div>
      <Child inputRef={inputRef} />
      <button onClick={handleClick}>Get Input Value</button>
      <p>Input Value: {text}</p>
    </div>
  );
};
```

## redux

除了上述的通信方式，我们还可以借助一些状态管理库完成通信，如 redux

redux 使用单一 store 作为数据源，状态的改变通过派发 action 完成，工作流程为，

1. 应用触发事件
2. 派发 action
3. 调用 reducer，传入当前状态和 action
4. reducer 计算新状态并返回
5. store 使用新状态替换旧状态，通知所有订阅者更新

下面是一个简单示例，

```tsx
import React, { useState } from "react";
import { createStore, combineReducers } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";

// 定义 action 类型
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// 定义 action 创建函数
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// 定义 reducer
const counter = (state = 0, action: { type: string }) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
};

// 创建 store
const rootReducer = combineReducers({ counter });
const store = createStore(rootReducer);

// 定义 Counter 组件
const Counter: React.FC = () => {
  const count = useSelector((state: { counter: number }) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={() => dispatch(increment())}>增加</button>
      <button onClick={() => dispatch(decrement())}>减少</button>
    </div>
  );
};

// 使用 Provider 包裹根组件
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};
```

## mobx

mobx 可以使用多个 store 作为数据源， 对于状态变化会自动追踪，允许直接修改可观察状态，心智负担更小，

下面是一个简单示例，

```tsx
import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class CounterStore {
  count: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}

const counterStore = new CounterStore();

const Counter: React.FC = observer(() => {
  const { count, increment, decrement } = counterStore;

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
});
```
