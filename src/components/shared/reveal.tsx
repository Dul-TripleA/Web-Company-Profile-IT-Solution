'use client';

import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

// Animasi masuk saat elemen terlihat di layar (library `motion`, ADR-020). Hanya fade + geser
// halus; berjalan sekali. Pengguna yang memilih "kurangi gerakan" melihat konten langsung tanpa
// animasi. Bagian paling atas halaman (hero) memakai animasi CSS agar tidak menunda LCP.

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: '0px 0px -80px 0px' } as const;

type Tag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'p' | 'h2' | 'article';
type BaseProps = { children: ReactNode; className?: string };

const TAGS = {
  div: m.div,
  section: m.section,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  p: m.p,
  h2: m.h2,
  article: m.article,
} as const;

function Provider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Elemen yang muncul dengan fade + geser ke atas saat masuk layar. */
export function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
  y = 24,
}: BaseProps & { as?: Tag; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  const Element = TAGS[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Provider>
      <Element
        data-reveal=""
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, delay, ease: EASE }}
      >
        {children}
      </Element>
    </Provider>
  );
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Daftar yang anak-anaknya (`RevealItem`) muncul bergantian. */
export function RevealList({
  children,
  className,
  as = 'ul',
}: BaseProps & { as?: 'ul' | 'ol' | 'div' }) {
  const reduce = useReducedMotion();
  const Element = TAGS[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Provider>
      <Element
        data-reveal=""
        className={className}
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {children}
      </Element>
    </Provider>
  );
}

export function RevealItem({
  children,
  className,
  as = 'li',
}: BaseProps & { as?: 'li' | 'div' | 'article' }) {
  const reduce = useReducedMotion();
  const Element = TAGS[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Provider>
      <Element data-reveal="" className={className} variants={itemVariants}>
        {children}
      </Element>
    </Provider>
  );
}
