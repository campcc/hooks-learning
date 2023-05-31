import React, { useState } from 'react'

function Parent(): React.FC {
  const [count, setCount] = useState<number>(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <Child count={count}>Children</Child>
    </>
  )
}

function Child(props): React.FC {
  const { count, children } = props

  return (
    <>
      <div>Received props from parent: {count}</div>
      <div>Received children from parent: {children}</div>
    </>
  )
}