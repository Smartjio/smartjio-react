import React from 'react'
import { Button, ButtonProps, Flex, useColorMode } from '@chakra-ui/react';
import { BsSun, BsMoonStarsFill } from 'react-icons/bs';

export default function ColourModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Button
          aria-label="Toggle Color Mode"
          onClick={toggleColorMode}
          _focus={{ boxShadow: 'none' }}
          w="fit-content">
          {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
        </Button>
    );
}
