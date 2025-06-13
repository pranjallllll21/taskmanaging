import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { XCircle } from 'lucide-react';

const FailurePopup = React.memo(({ taskName, onClose }) => {
  const popupRef = useRef(null);
  const contentRef = useRef(null);
  const timelineRef = useRef(null);

  const animateOut = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    gsap.to(popupRef.current, {
      scale: 0.8,
      opacity: 0,
      y: -50,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: onClose
    });
  }, [onClose]);

  useEffect(() => {
    const popup = popupRef.current;
    const content = contentRef.current;

    // Create timeline for better control
    timelineRef.current = gsap.timeline();

    // Initial state
    gsap.set(popup, { 
      scale: 0.8,
      opacity: 0,
      y: -50
    });

    // Animate in
    timelineRef.current
      .to(popup, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
      .from(content, {
        opacity: 0,
        y: 20,
        duration: 0.3
      }, "-=0.2");

    // Auto close after 3 seconds
    const timer = setTimeout(animateOut, 3000);

    return () => {
      clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [animateOut]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={animateOut}
      />
      <div
        ref={popupRef}
        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div ref={contentRef} className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Task Failed
          </h3>
          <p className="text-gray-600 mb-4">
            {taskName} has failed to execute
          </p>
          <button
            onClick={animateOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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