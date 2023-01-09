import { Button, ButtonGroup, Highlight, Image, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getStocks } from '../service/Api';
import DrawerStockDetail from './DrawerStockDetail';
import Loading from './Loading';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";
import PaginationNumbers from './pagination/PaginationNumbers';

const Stock = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const { status, error, data } = useQuery(
    {
      queryKey: ["stocks"],
      queryFn: getStocks,
    },
  );

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }

  const handleShow = (stockId) => {
    onOpen();
    setSelectedStockId(stockId)
  };

  const pageSize = 20;
  const pageShowData = pageSize * pageNumber;
  const pageData = data.slice((pageShowData - pageSize), pageShowData);
  const paginationNumber = Math.ceil(data.length / pageSize);

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  };
  const nextPage = () => {
    if (pageData.length > 0) {
      setPageNumber(pageNumber + 1)
    }
  }

  return (
    <>
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
              React.Children.toArray(pageData.map(stock => (
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
      <Stack direction='row' spacing={4} justifyContent='center' my={5}>
        <Button onClick={previousPage} disabled={pageNumber === 1} colorScheme='teal' variant='outline'>
          <Icon mr={2} as={MdOutlineArrowBackIosNew} />Prev
        </Button>
        <PaginationNumbers paginationNumber={paginationNumber} pageNumber={pageNumber} setPageNumber={setPageNumber}/>
        <Button onClick={nextPage} disabled={pageData.length < pageSize} colorScheme='teal' variant='solid'>
          Next<Icon ml={2} mt={0.5} as={MdOutlineArrowForwardIos} />
        </Button>
      </Stack>
    </>
  )
}

export default Stock;
