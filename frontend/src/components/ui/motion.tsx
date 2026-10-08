'use client';

import { motion, HTMLMotionProps, Variant } from 'framer-motion';
import { forwardRef, ComponentPropsWithoutRef } from 'react';

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const createMotionComponent = <T extends keyof JSX.IntrinsicElements>(
  component: T,
  defaultVariants?: Variant
) => {
  return forwardRef<any, ComponentPropsWithoutRef<T>>(
    ({ variants = defaultVariants, initial = 'hidden', animate = 'visible', exit, transition, ...props }, ref) => {
      return (
        <motion.component
          ref={ref}
          variants={variants}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          {...props}
        />
      );
    }
  );
};

export const MotionDiv = createMotionComponent('div', fadeIn);
export const MotionSection = createMotionComponent('section', fadeIn);
export const MotionArticle = createMotionComponent('article', fadeIn);
export const MotionSpan = createMotionComponent('span', fadeIn);
export const MotionButton = createMotionComponent('button', {
  ...fadeIn,
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
});
export const MotionLi = createMotionComponent('li', staggerItem);

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: Variant;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = slideUp,
  once = true,
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold, rootMargin }}
      variants={{ hidden: variant.hidden, visible: variant.visible }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatePresenceWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}