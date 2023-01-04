import { Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import AddStock from './components/AddStock';
import Stock from './components/Stock';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box m={10}>
        <AddStock />
        <Stock />
      </Box>
    </QueryClientProvider>
  );
}

export default App;
