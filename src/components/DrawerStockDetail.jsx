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
    Image,
    Input,
    useToast,
    VStack,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteStock, updateStock } from "../service/Api";


const DrawerStockDetail = ({ isOpen, onClose, selectedStockId }) => {
    const queryClient = useQueryClient();
    const selectedStock = queryClient.getQueryData('stocks').find(stock => stock?.id === selectedStockId);
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const toast = useToast();

    useEffect(() => {
        setImage(selectedStock?.image);
        setName(selectedStock?.name);
        setCode(selectedStock?.code);
        setQuantity(selectedStock?.quantity);
        setUnit(selectedStock?.unit);
    }, [selectedStock]);


    const updateMutation = useMutation({
        mutationFn: updateStock,
        onSuccess: () => {
            toast(
                {
                    title: "stock updated",
                    /* description: "We've created your account for you.", */
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                }
            )
        },
        onError: async (error, variables, context) => {
            toast(
                {
                    title: "stock cannot be updated",
                    /* description: "We've created your account for you.", */
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                }
            );
        },
        // Always refetch after error or success:
        onSettled: async (data, error, variables, context) => {
            await queryClient.invalidateQueries('stocks'); //refetch the collection on the background
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteStock,
        onSuccess: () => {
            toast(
                {
                    title: "stock deleted",
                    /* description: "We've created your account for you.", */
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                }
            )
        },
        onError: async (error, variables, context) => {
            toast(
                {
                    title: "stock cannot be deleted",
                    /* description: "We've created your account for you.", */
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                }
            );
        },
        // Always refetch after error or success:
        onSettled: async (data, error, variables, context) => {
            await queryClient.invalidateQueries('stocks'); //refetch the collection on the background
        },
    })

    const handleUpdate = async (e) => {
        e.preventDefault();
        const nowDate = Date.now();
        const today = new Date(nowDate);
        const updateStock = {
            "id": selectedStock?.id,
            "image": image,
            "name": name,
            "code": code,
            "quantity": quantity,
            "unit": unit,
            "createdAt": today.toLocaleDateString(),
        };
        try {
            await updateMutation.mutateAsync(updateStock)
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

    const handleDelete = async (id) => {
        try {
            await deleteMutation.mutateAsync(id);
            onClose();
        } catch (error) {
            throw new Error("Something is wrong!", { cause: error })
        }
    }
    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size="md"
        >
            <DrawerOverlay />
            <form onSubmit={handleUpdate}>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{selectedStock?.name}</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={15}>
                            <Image
                                src={image !== "" ? image : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"}
                                alt="Green double couch with wooden legs"
                                borderRadius="lg"
                                objectFit='contain'
                                h="100px"
                                m="auto"
                                py={2}
                            />
                            <FormControl>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Image URL
                                </FormLabel>
                                <Input
                                    value={image || ''}
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
                                    value={name || ''}
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
                                    value={code || ''}
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
                                    value={quantity || ''}
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
                                    value={unit || ''}
                                    onChange={(e) => setUnit(e.target.value)}
                                    type="text"
                                    placeholder="Unit"
                                />
                            </FormControl>
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter justifyContent="flex-start">
                        <Button onClick={() => handleDelete(selectedStock?.id)} variant="outline" colorScheme="red" mr={3}>
                            Delete
                        </Button>
                        <Button type="submit" colorScheme="green">
                            Update
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </form>
        </Drawer>
    );
};

export default memo(DrawerStockDetail);
