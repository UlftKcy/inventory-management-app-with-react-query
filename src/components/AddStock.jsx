import { Box, Button, useDisclosure } from '@chakra-ui/react'
import React, { useRef } from 'react'
import DrawerStock from './DrawerStock'

const AddStock = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef();
    
    return (
        <Box display="flex" justifyContent="end" mb={5} pr={5}>
            <Button colorScheme="blue" ref={btnRef} onClick={onOpen}>Add Stock</Button>
            <DrawerStock isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
        </Box>
    )
}

export default AddStock
