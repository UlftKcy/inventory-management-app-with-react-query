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
    VStack,
} from "@chakra-ui/react";
import React, { memo, useReducer } from "react";
import Mutation from "../utils/mutation";

const DrawerStockCreate = ({ isOpen, onClose, btnRef }) => {
    const [stock, createStock] = useReducer((prev, next) => {
        return { ...prev, ...next }
    }, {
        image: "", name: "", code: "", quantity: null, unit: ""
    });

    const { addStockMutation } = Mutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nowDate = Date.now();
        const today = new Date(nowDate);
        const newStock = {
            "image": stock.image,
            "name": stock.name,
            "code": stock.code,
            "quantity": stock.quantity,
            "unit": stock.unit,
            "createdAt": today.toLocaleDateString(),
        };
        try {
            await addStockMutation.mutateAsync(newStock);
            onClose();
            createStock({ image: "" });
            createStock({ name: "" });
            createStock({ code: "" });
            createStock({ quantity: "" });
            createStock({ unit: "" });
        } catch (error) {
            throw new Error("Something is wrong!", { cause: error });
        }
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
                                    onChange={(e) => createStock({ image: e.target.value })}
                                    type="text"
                                    placeholder="Stock image url"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Name
                                </FormLabel>
                                <Input
                                    onChange={(e) => createStock({ name: e.target.value })}
                                    type="text"
                                    placeholder="Stock name"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Stock Code
                                </FormLabel>
                                <Input
                                    onChange={(e) => createStock({ code: e.target.value })}
                                    type="text"
                                    placeholder="Stock code"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Quantity
                                </FormLabel>
                                <Input
                                    onChange={(e) => createStock({ quantity: e.target.value })}
                                    type="number"
                                    placeholder="Quantity"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="blackAlpha.700">
                                    Unit
                                </FormLabel>
                                <Input
                                    onChange={(e) => createStock({ unit: e.target.value })}
                                    type="text"
                                    placeholder="Unit"
                                />
                            </FormControl>
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter display="flex" justifyContent="flex-start">
                        <Button type="submit"
                            colorScheme="teal"
                            isLoading={addStockMutation.isLoading}
                            loadingText='Creating'
                            mr={3}
                        >
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

export default memo(DrawerStockCreate);
