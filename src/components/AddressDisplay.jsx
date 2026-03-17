import React, { useState, useLayoutEffect, useRef } from 'react';

const shortenAddress = (address) => {
    if (typeof address !== 'string' || address.length <= 10) {
        return address;
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const AddressDisplay = ({ address, blockExplorerUrl }) => {
    const [displayText, setDisplayText] = useState(address);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        if (!containerRef.current || !textRef.current) {
            return;
        }

        const checkOverflow = () => {
            const containerWidth = containerRef.current.clientWidth;
            
            // Use a temporary span to measure the full address width without affecting the current display
            const tempSpan = document.createElement('span');
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'nowrap';
            tempSpan.textContent = address;
            document.body.appendChild(tempSpan);
            const textWidth = tempSpan.scrollWidth;
            document.body.removeChild(tempSpan);

            if (textWidth > containerWidth) {
                const shortened = shortenAddress(address);
                if (displayText !== shortened) {
                    setDisplayText(shortened);
                }
            } else {
                if (displayText !== address) {
                    setDisplayText(address);
                }
            }
        };

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(containerRef.current);

        checkOverflow(); // Initial check

        return () => resizeObserver.disconnect();
    }, [address, displayText]);

    const link = blockExplorerUrl && address ? `${blockExplorerUrl}/address/${address}` : '#';

    return (
        <div ref={containerRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                <span ref={textRef}>{displayText}</span>
            </a>
        </div>
    );
};

export default AddressDisplay;
