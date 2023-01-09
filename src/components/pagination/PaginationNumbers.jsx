import { Button } from "@chakra-ui/react";
import React from "react";

const PaginationNumbers = ({ paginationNumber, pageNumber,setPageNumber }) => {

    const paginationPageNumbers = [];
    for (let i = 1; i <= paginationNumber; i++) {
        paginationPageNumbers.push(i);
    }

    return paginationPageNumbers.map((paginationPageNumber) => (
        <Button onClick={() => setPageNumber(paginationPageNumber)} color={pageNumber === paginationPageNumber ? "gray.800" : "gray.400"}>{paginationPageNumber}</Button>
    ));
};

export default PaginationNumbers;
