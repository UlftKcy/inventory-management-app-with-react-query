// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. breakpoints
const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '67em',
  xl: '80em',
  '2xl': '96em',
}
// 3. extend the theme
const theme = extendTheme({ config,breakpoints})

export default theme;