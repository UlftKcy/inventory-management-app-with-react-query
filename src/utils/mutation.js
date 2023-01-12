import { useMutation, useQueryClient } from "react-query";
import { addStock, deleteStock, updateStock } from "../service/Api";
import { useToast } from "@chakra-ui/react";

const Mutation = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    // create stock mutation
    const addStockMutation = useMutation(addStock, {
        // When mutate is called:
        onMutate: async (newStock) => {
            await queryClient.cancelQueries(["stocks"]); //cancel any in-flight or pending query to the `stocks` key
            const previousStock = queryClient.getQueryData(["stocks"]); // retrieve the cached data
            return {
                previousStock,
                newStock,
            };
        },
        onSuccess: async (data, variables, context) => {
            //  use to immediately update a query's cached data
            queryClient.setQueryData(['stocks', { id: context.newStock.id }], context.newStock)
            toast({
                title: "stock created",
                /* description: "We've created your account for you.", */
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        onError: async (error, variables, context) => {
            await queryClient.setQueryData("stocks", context.previousStock); //rollback the cache to the previous state
            toast({
                title: "stock cannot be created",
                /* description: "We've created your account for you.", */
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        // Always refetch after error or success:
        onSettled: async (data, error, variables, context) => {
            await queryClient.invalidateQueries("stocks"); //refetch the collection on the background
        },
    });
    // update stock mutation
    const updateMutation = useMutation({
        mutationFn: updateStock,
        onSuccess: (updateStock) => {
            //  use to immediately update a query's cached data
            queryClient.setQueryData(['stocks', { id: updateStock.id }], updateStock)
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
    // delete stock mutation
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
    return {
        addStockMutation,updateMutation,deleteMutation
    }
}

export default Mutation;

