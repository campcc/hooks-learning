import React, { useState } from 'react'

function Parent(): React.FC {
  const [count, setCount] = useState<number>(0)

  return (
    <>
      <div>Received from child: {count}</div>
      <Child updateCount={(value: number) => setCount(value)} />
    </>
  )
}

function Child(props): React.FC {
  const { updateCount } = props
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <button
        onClick={() => {
          const newCount: number = count + 1
          setCount(newCount)
          updateCount(newCount)
        }}
      >
        Add
      </button>
    </div>
  )
}