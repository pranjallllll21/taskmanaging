import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { XCircle } from 'lucide-react';

const FailurePopup = React.memo(({ taskName, onClose, isDarkMode }) => {
  const popupRef = useRef(null);
  const contentRef = useRef(null);
  // const timelineRef = useRef(null); // Temporarily remove timelineRef

  const animateOut = useCallback(() => {
    onClose(); // Directly call onClose without animation
  }, [onClose]);

  useEffect(() => {
    const popup = popupRef.current;
    // const content = contentRef.current;

    // Re-introduce initial popup animation only
    gsap.set(popup, {
      scale: 0.8,
      opacity: 0,
      y: -50
    });
    gsap.to(popup, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    // Auto close after 3 seconds
    const timer = setTimeout(animateOut, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [animateOut]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 transition-colors duration-200"
        onClick={animateOut}
      />
      <div
        ref={popupRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transition-colors duration-200"
      >
        <div ref={contentRef} className="text-center">
          <XCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Task Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {taskName ? `${taskName} has failed to execute` : 'A task has failed to execute.'}
          </p>
          <button
            onClick={animateOut}
            className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-600 transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
});

FailurePopup.displayName = 'FailurePopup';

export default FailurePopup; 
