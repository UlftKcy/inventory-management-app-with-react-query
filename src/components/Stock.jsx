import { Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { getStocks } from '../service/Api';

const Stock = () => {
  const { status, error, data } = useQuery(
    {
      queryKey: ["stocks"],
      queryFn: getStocks,
    },
  );

  if (status === 'loading') {
    return <span>Loading...</span>
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }


  return (
    <TableContainer border="1px" borderColor="gray.300" rounded="lg" p={5}>
      <Table variant='simple' size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Stock Name</Th>
            <Th>Stock Code</Th>
            <Th>Quantity</Th>
            <Th>unit</Th>
          </Tr>
        </Thead>
        <Tbody>
          {React.Children.toArray(data.map(stock => (
            <Tr _hover={{ bg: "gray.200" }}>
              <Td>
                <Image
                  objectFit='cover'
                  maxW='30px' maxH='30px'
                  src={stock.image !== "" ? stock.image : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"}
                  alt={stock.name}
                /></Td>
              <Td>{stock.name}</Td>
              <Td>{stock.code}</Td>
              <Td>{stock.quantity}</Td>
              <Td>{stock.unit}</Td>
            </Tr>
          )))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default Stock;
