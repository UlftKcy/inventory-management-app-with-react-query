import {
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Image,
    List,
    ListIcon,
    ListItem,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { useQueryClient } from "react-query";
import { AiOutlineNumber } from "react-icons/ai";
import { FaUnity } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md"

const DrawerStockDetail = ({ isOpen, onClose, selectedStockId }) => {
    const queryClient = useQueryClient();
    const selectedStock = queryClient.getQueryData('stocks').find(stock => stock.id === selectedStockId);

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size="md"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{selectedStock?.name}</DrawerHeader>
                <DrawerBody>
                    <Image
                        src={selectedStock?.image !== "" ? selectedStock?.image : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"}
                        alt="Green double couch with wooden legs"
                        borderRadius="lg"
                        objectFit='cover'
                        maxW={{ base: '100%', sm: '200px' }} h="100px"
                        m="auto"
                    />
                    <Divider orientation='horizontal' my={5} />
                    <Stack spacing="3">
                        <List spacing={3}>
                            <ListItem display="flex" alignItems="center">
                                <ListIcon as={AiOutlineNumber} color='green.500' boxSize={6} />
                                <Text w="100px">Stock Code : </Text>
                                <Text fontWeight="bold" color="blackAlpha.700">{selectedStock?.code}</Text>
                            </ListItem>
                            <ListItem display="flex" alignItems="center">
                                <ListIcon as={MdProductionQuantityLimits} color='green.500' boxSize={6} />
                                <Text w="100px">Quantity : </Text>
                                <Text fontWeight="bold" color="blackAlpha.700">{selectedStock?.quantity}</Text>
                            </ListItem>
                            <ListItem display="flex" alignItems="center">
                                <ListIcon as={FaUnity} color='green.500' boxSize={6} />
                                <Text w="100px">Unit : </Text>
                                <Text fontWeight="bold" color="blackAlpha.700">{selectedStock?.unit}</Text>
                            </ListItem>
                        </List>
                    </Stack>
                </DrawerBody>

                <DrawerFooter justifyContent="flex-start">
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue">Düzenle</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default memo(DrawerStockDetail);
