import { useEffect } from 'react';

/**
 * Locks body scroll while a modal is mounted and restores it on unmount.
 * Reference-counted so nested modals don't unlock scroll prematurely.
 * Also preserves scroll position to avoid jump-to-top on close.
 */

let _openCount = 0;

export function useModalBodyClass() {
    useEffect(() => {
        _openCount++;

        if (_openCount === 1) {
            // Save current scroll position before locking
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            // Store values for restoration
            document.body.dataset.scrollY = scrollY;
            document.body.dataset.scrollX = scrollX;
        }

        return () => {
            _openCount = Math.max(0, _openCount - 1);
            if (_openCount === 0) {
                const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
                const scrollX = parseInt(document.body.dataset.scrollX || '0', 10);
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                delete document.body.dataset.scrollY;
                delete document.body.dataset.scrollX;
                // Restore scroll position
                window.scrollTo(scrollX, scrollY);
            }
        };
    }, []);
}
