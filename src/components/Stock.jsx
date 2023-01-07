import { Button, ButtonGroup, Highlight, Image, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getStocks } from '../service/Api';
import DrawerStockDetail from './DrawerStockDetail';
import Loading from './Loading';

const Stock = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStockId, setSelectedStockId] = useState(null);

  const { status, error, data } = useQuery(
    {
      queryKey: ["stocks"],
      queryFn: getStocks,
    },
  );

  if (status === 'loading') {
    return <Loading/>
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }

  const handleShow = (stockId) => {
    onOpen();
    setSelectedStockId(stockId)
  };


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
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data ? (
            React.Children.toArray(data.map(stock => (
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
                <Td>
                  <ButtonGroup gap='4'>
                    <Button colorScheme="green" variant="outline" size="sm" onClick={() => handleShow(stock.id)}>Stock Detail</Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            )))
          ) : (
            <Tr>
              <Td colSpan="6" textAlign="center" py={3}>
                <Highlight query='No stock to show.' styles={{ px: '4', py: '2', rounded: 'full', bg: 'teal.100' }}>
                  No stock to show.
                </Highlight>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <DrawerStockDetail isOpen={isOpen} onClose={onClose} selectedStockId={selectedStockId} />
    </TableContainer>
  )
}

export default Stock;
