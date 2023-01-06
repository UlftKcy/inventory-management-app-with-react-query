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
import React, { memo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addStock } from "../service/Api";

const DrawerStock = ({ isOpen, onClose, btnRef }) => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const toast = useToast();
    const queryClient = useQueryClient();

    const addStockMutation = useMutation(addStock, {
        // When mutate is called:
        onMutate: async (newStock) => {
            await queryClient.cancelQueries(['stocks']);  //cancel any in-flight or pending query to the `stocks` key
            const previousStock = queryClient.getQueryData(['stocks']); // retrieve the cached data 
            return {
                previousStock,
                newStock
            };
        },
        onSuccess: async (data, variables, context) => {
            // invalidate cache and refetch
            await queryClient.invalidateQueries("stocks");
            toast(
                {
                    title: "stock created",
                    /* description: "We've created your account for you.", */
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                }
            );
        },
        onError: async (error, variables, context) => {
            await queryClient.setQueryData('stocks', context.previousStock) //rollback the cache to the previous state
            toast(
                {
                    title: "stock cannot be created",
                    /* description: "We've created your account for you.", */
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                }
            );
        },
        // Always refetch after error or success:
        onSettled: async (data, error, variables, context) => {
            await queryClient.invalidateQueries('stocks'); //refetch the collection on the background
        },
    });

    const handleSubmit = async (e) => {
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
        try {
            await addStockMutation.mutateAsync(newStock)
            onClose();
            setImage("");
            setName("");
            setCode("");
            setQuantity("");
            setUnit("");
        } catch (error) {
            throw new Error("Something is wrong!", { cause: error })
        }
    }
    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
            size="lg"
        >
            <DrawerOverlay />
            <form onSubmit={handleSubmit}>
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

export default memo(DrawerStock);
