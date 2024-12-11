// import { createContext, useContext, useState } from 'react';

// const DrawerContext = createContext();

// export const useDrawer = () => useContext(DrawerContext);

// export const DrawerProvider = ({ children }) => {
//     const [open, setOpen] = useState(false);
//     const [pinned, setPinned] = useState(false);

//     const handleDrawerOpen = () => {
//         setOpen(!open);
//     };

//     // Toggle the pinning state
//     const handlePinToggle = () => {
//         setPinned((prevPinned) => !prevPinned);
//     };

//     return (
//         <DrawerContext.Provider value={{ open, handleDrawerOpen, setOpen, handlePinToggle, pinned, setPinned }}>
//             {children}
//         </DrawerContext.Provider>
//     );
// };

import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    // Toggle the pinning state
    const handlePinToggle = () => {
        setPinned((prevPinned) => !prevPinned);
    };

    return (
        <DrawerContext.Provider value={{ open, handleDrawerOpen, setOpen, handlePinToggle, pinned, setPinned }}>
            {children}
        </DrawerContext.Provider>
    );
};
