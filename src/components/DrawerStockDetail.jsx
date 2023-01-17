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
import placeholder from "../assets/images/placeholder.png";
import React, { memo, useEffect, useReducer } from "react";
import { useQueryClient } from "react-query";
import Mutation from "../utils/mutation";


const DrawerStockDetail = ({ isOpen, onClose, selectedStockId }) => {
    // const [state, dispatch] = useReducer(reducer, initialArg, init?)
    const [stock, updatedStock] = useReducer((prev, next) => {
        return { ...prev, ...next }
    }, {
        image: "", name: "", code: "", quantity: null, unit: ""
    });

    const queryClient = useQueryClient();
    const selectedStock = queryClient.getQueryData('stocks').find(stock => stock?.id === selectedStockId);

    useEffect(() => {
        updatedStock({ image: selectedStock?.image });
        updatedStock({ name: selectedStock?.name });
        updatedStock({ code: selectedStock?.code });
        updatedStock({ quantity: selectedStock?.quantity });
        updatedStock({ unit: selectedStock?.unit });
    }, [selectedStock]);

    const { updateMutation, deleteMutation } = Mutation();

    const handleUpdate = async (e) => {
        e.preventDefault();
        const nowDate = Date.now();
        const today = new Date(nowDate);
        const updateStock = {
            "id": selectedStock?.id,
            "image": stock.image,
            "name": stock.name,
            "code": stock.code,
            "quantity": stock.quantity,
            "unit": stock.unit,
            "createdAt": today.toLocaleDateString(),
        };
        try {
            await updateMutation.mutateAsync(updateStock)
            onClose();
            updatedStock({ image: "" });
            updatedStock({ name: "" });
            updatedStock({ code: "" });
            updatedStock({ quantity: "" });
            updatedStock({ unit: "" });
        } catch (error) {
            throw new Error("Something is wrong!", { cause: error })
        }
    };

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
                                src={stock.image}
                                fallbackSrc={placeholder}
                                alt="Green double couch with wooden legs"
                                borderRadius="lg"
                                objectFit='contain'
                                w="150px"
                                h="150px"
                                m="auto"
                                py={2}
                            />
                            <FormControl>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Image URL
                                </FormLabel>
                                <Input
                                    value={stock.image || ''}
                                    onChange={(e) => updatedStock({ image: e.target.value })}
                                    type="text"
                                    placeholder="Stock image url"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Name
                                </FormLabel>
                                <Input
                                    value={stock.name || ''}
                                    onChange={(e) => updatedStock({ name: e.target.value })}
                                    type="text"
                                    placeholder="Stock name"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Code
                                </FormLabel>
                                <Input
                                    value={stock.code || ''}
                                    onChange={(e) => updatedStock({ code: e.target.value })}
                                    type="text"
                                    placeholder="Stock code"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Quantity
                                </FormLabel>
                                <Input
                                    value={stock.quantity || ''}
                                    onChange={(e) => updatedStock({ quantity: e.target.value })}
                                    type="number"
                                    placeholder="Quantity"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Unit
                                </FormLabel>
                                <Input
                                    value={stock.unit || ''}
                                    onChange={(e) => updatedStock({ unit: e.target.value })}
                                    type="text"
                                    placeholder="Unit"
                                />
                            </FormControl>
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter justifyContent="flex-start">
                        <Button isLoading={deleteMutation.isLoading}
                            loadingText='Deleting' onClick={() => handleDelete(selectedStock?.id)} variant="outline" colorScheme="red" mr={3}>
                            Delete
                        </Button>
                        <Button isLoading={updateMutation.isLoading}
                            loadingText='Updating' type="submit" colorScheme="green">
                            Update
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </form>
        </Drawer>
    );
};

export default memo(DrawerStockDetail);
