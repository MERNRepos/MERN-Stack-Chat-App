// DecorativeBox.tsx or DecorativeBox.jsx
import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const DecorativeBox = ({
    children,
    ...props
}: {
    children?: ReactNode; // ✅ make it optional
    [x: string]: any;
}) => {
    return (
        <Box
            p={4}
            borderRadius="lg"
            boxShadow="md"
            bgGradient="linear(to-r, teal.100, blue.100)"
            {...props}
        >
            {children}
        </Box>
    );
};
