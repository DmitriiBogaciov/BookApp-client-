import { useState } from 'react';

const MenuButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <button onClick={toggleMenu}
                className='hidden-md-down flex items-center px-3 py-2 border rouded rext-black border-black'
            >
                <svg
                    className='fill-current h-3 w-3'
                    viewBox='0 0 20 20'
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                </svg>
            </button>
        </div>
    )
}