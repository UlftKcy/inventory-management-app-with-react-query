import { Button } from "@chakra-ui/react";
import React, { memo } from "react";

const PaginationNumbers = ({ paginationNumber, pageNumber,setPageNumber }) => {

    const paginationPageNumbers = [];
    for (let i = 1; i <= paginationNumber; i++) {
        paginationPageNumbers.push(i);
    }

    return React.Children.toArray(paginationPageNumbers.map((paginationPageNumber) => (
        <Button _hover={{ bg:"gray.300" }} onClick={() => setPageNumber(paginationPageNumber)} color={pageNumber === paginationPageNumber ? "gray.800" : "gray.400"}>{paginationPageNumber}</Button>
    )));
};

export default memo(PaginationNumbers);
