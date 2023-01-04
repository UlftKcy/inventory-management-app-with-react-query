import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormLabel,
    Input,
    useToast,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const DrawerStock = ({ isOpen, onClose, btnRef }) => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const toast = useToast();
    const queryClient = useQueryClient();

    const createStock = (newStock) => {
        axios.post(`https://63b519689f50390584c0823d.mockapi.io/inventory`, newStock);
    };

    const mutation = useMutation((newStock) => createStock(newStock), {
        // When mutate is called:
        onMutate: async (newStock) => {
            await queryClient.cancelQueries(['stocks']);  //cancel any in-flight or pending query to the `stocks` key
            const previousStock = queryClient.getQueryData(['stocks']); // retrieve the cached data 
            queryClient.setQueryData('stocks', (old) => [...old, newStock]);
            // return the previous list and the newTodo to be used later inside the context
            return {
                previousStock,
                newStock
            };
        },
        onSuccess: () => {
            onClose();
            toast({
                title: 'Stock created.',
                /* description: "We've created your account for you.", */
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            })
        },
        onError: (err, context) => {
            queryClient.setQueryData('stocks', context.previousStock) //rollback the cache to the previous state
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries('stocks'); //refetch the collection on the background
        },
    });

    const onCreateStock = (e) => {
        e.preventDefault();
        const nowDate = Date.now();
        const today = new Date(nowDate);

        const newStock = {
            "image": image,
            "name": name,
            "code": code,
            "quantity": quantity,
            "unit": unit,
            "createdAt": today.toLocaleDateString(),
        };
        mutation.mutate(newStock);
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
            size="lg"
        >
            <DrawerOverlay />
            <form onSubmit={onCreateStock}>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create New Stock</DrawerHeader>
                    <DrawerBody>

                        <VStack spacing={15}>
                            <FormControl>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Image URL
                                </FormLabel>
                                <Input
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    type="text"
                                    placeholder="Stock image url"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Name
                                </FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="Stock name"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Code
                                </FormLabel>
                                <Input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    type="text"
                                    placeholder="Stock code"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Quantity
                                </FormLabel>
                                <Input
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    type="number"
                                    placeholder="Quantity"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Unit
                                </FormLabel>
                                <Input
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    type="text"
                                    placeholder="Unit"
                                />
                            </FormControl>
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter display="flex" justifyContent="flex-start">
                        <Button type="submit" colorScheme="teal" mr={3}>
                            Save
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </form>
        </Drawer>
    );
};

export default DrawerStock;
