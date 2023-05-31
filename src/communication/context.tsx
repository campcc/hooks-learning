import React, { useState, useContext } from 'react'

enum Theme {
  Light,
  Dark
}

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>(null)

function ThemeProvider(props): React.FC {
  const { children } = props
  const [theme, setTheme] = useState<Theme>(Theme.Light)

  const toggle = () => {
    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}


function App(): React.FC {
  const context = useContext(ThemeContext)
  const { theme, toggle } = context

  return (
    <ThemeProvider>
      <div>
        <p>Current theme: {theme === Theme.Light ? 'light' : 'dark'}</p>
        <button onClick={toggle}>toggle theme</button>
      </div>
    </ThemeProvider >
  )
}