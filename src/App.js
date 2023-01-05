import { Box } from '@chakra-ui/react';
import './App.css';
import AddStock from './components/AddStock';
import Stock from './components/Stock';

function App() {
  return (
    <Box m={10}>
      <AddStock />
      <Stock />
    </Box>
  );
}

export default App;
