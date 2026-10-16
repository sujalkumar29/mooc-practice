import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const STORAGE_KEY = 'mooc_practice_scroll_history_v1';

// Fast in-memory cache for history entries and paths
const memoryScrollHistory = new Map();

// Dedicated store for course source scroll positions before entering quizzes
const courseSourceScrollStore = new Map();

function getStoredPositions() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persists vertical scroll position for a history entry and pathname.
 * Guards against overwriting a genuine non-zero scroll position with 0 during page transitions.
 */
export function persistScrollPosition(key, pathname, y) {
  if (typeof window === 'undefined') return;
  const numY = Math.max(0, Math.round(y));

  // Protection: never overwrite a known non-zero position with 0 during route changes
  if (numY === 0) {
    const existingKeyPos = key ? memoryScrollHistory.get(key) : null;
    const existingPathPos = pathname ? memoryScrollHistory.get(`path:${pathname}`) : null;
    if ((typeof existingKeyPos === 'number' && existingKeyPos > 20) ||
        (typeof existingPathPos === 'number' && existingPathPos > 20)) {
      return;
    }
  }

  if (key) {
    memoryScrollHistory.set(key, numY);
  }
  if (pathname) {
    memoryScrollHistory.set(`path:${pathname}`, numY);
  }

  try {
    const stored = getStoredPositions();
    if (key) stored[key] = numY;
    if (pathname) stored[`path:${pathname}`] = numY;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Ignore quota or privacy restrictions
  }
}

/**
 * Specifically preserves a course page's scroll position and history key before entering a quiz.
 */
export function preserveCourseScroll(courseSlugOrPath, key, y) {
  if (typeof window === 'undefined') return;
  const numY = Math.max(0, Math.round(y));
  if (numY > 0) {
    const cleanSlug = String(courseSlugOrPath).replace(/^\/subjects\/?/, '').split('/')[0];
    if (key) memoryScrollHistory.set(key, numY);
    if (cleanSlug) {
      courseSourceScrollStore.set(cleanSlug, { key, y: numY });
      memoryScrollHistory.set(`course:${cleanSlug}`, numY);
      memoryScrollHistory.set(`path:/subjects/${cleanSlug}`, numY);
    }

    try {
      const stored = getStoredPositions();
      if (key) stored[key] = numY;
      if (cleanSlug) {
        stored[`course:${cleanSlug}`] = numY;
        stored[`path:/subjects/${cleanSlug}`] = numY;
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Ignore quota restrictions
    }
  }
}

/**
 * Retrieves the preserved scroll position for a course.
 */
export function getPreservedCourseScroll(courseSlugOrPath) {
  const cleanSlug = String(courseSlugOrPath || '').replace(/^\/subjects\/?/, '').split('/')[0];
  if (cleanSlug && courseSourceScrollStore.has(cleanSlug)) {
    return courseSourceScrollStore.get(cleanSlug);
  }
  const stored = getStoredPositions();
  if (cleanSlug && typeof stored[`course:${cleanSlug}`] === 'number') {
    return { key: null, y: stored[`course:${cleanSlug}`] };
  }
  return null;
}

/**
 * Retrieves saved scroll position by history key (priority) or pathname fallback.
 */
export function getSavedScrollPosition(key, pathname) {
  // 1. Check in-memory by history key
  if (key && memoryScrollHistory.has(key)) {
    return memoryScrollHistory.get(key);
  }
  // 2. Check sessionStorage by history key
  const stored = getStoredPositions();
  if (key && typeof stored[key] === 'number') {
    return stored[key];
  }
  // 3. Fallback: by pathname
  if (pathname && memoryScrollHistory.has(`path:${pathname}`)) {
    return memoryScrollHistory.get(`path:${pathname}`);
  }
  if (pathname && typeof stored[`path:${pathname}`] === 'number') {
    return stored[`path:${pathname}`];
  }
  return null;
}

/**
 * Applies instant scroll without animation.
 */
export function applyInstantScroll(y) {
  if (typeof window === 'undefined') return;
  window.scrollTo({
    top: y,
    left: 0,
    behavior: 'instant'
  });
  if (document.documentElement) {
    document.documentElement.scrollTop = y;
  }
  if (document.body) {
    document.body.scrollTop = y;
  }
  const main = document.querySelector('.main-content');
  if (main && main.scrollTop > 0) {
    main.scrollTop = 0;
  }
}

/**
 * Checks if user has requested reduced motion.
 */
export function isReducedMotionPreferred() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detects if the current document was loaded via reload / refresh, direct navigation, or back_forward.
 */
export function getDocumentNavigationType() {
  if (typeof window === 'undefined') return 'navigate';
  try {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type; // 'reload' | 'navigate' | 'back_forward' | 'prerender'
      }
    }
  } catch (e) {}

  try {
    if (typeof performance !== 'undefined' && performance.navigation) {
      const typeNum = performance.navigation.type;
      if (typeNum === 1) return 'reload';
      if (typeNum === 2) return 'back_forward';
      return 'navigate';
    }
  } catch (e) {}

  return 'navigate';
}

/**
 * ScrollToTop Component
 * 
 * Manages history-aware scroll restoration across MOOC Practice:
 * - Page Refresh (reload) and direct URL load reset scroll to the very top (scrollY = 0).
 * - Forward navigation (PUSH) to a new page resets scroll to top (0, 0) instantly.
 * - Browser Back (POP) & Browser Forward (POP): Page appears at top and smoothly scrolls down
 *   to the exact saved position where the user left off.
 * - Internal back buttons (Exit Quiz, Back to Course, Back to Subjects): Smooth downward scroll restoration.
 * - Dedicated course-to-quiz source preservation prevents 0-clobbering on unmount.
 * - Respects prefers-reduced-motion with instant restoration.
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { pathname, search, hash, key, state } = location;

  const currentLocationRef = useRef({ key, pathname });
  currentLocationRef.current = { key, pathname };

  const prevLocationRef = useRef(null);
  const animFrameRef = useRef(null);
  const isRestoringRef = useRef(false);
  const isInitialMountRef = useRef(true);

  // Set manual browser scroll restoration to prevent native browser conflicts with SPA routing
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      const original = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = original;
      };
    }
  }, []);

  // Cancel restoration if user manually scrolls or interacts with page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onUserInteract = () => {
      if (isRestoringRef.current) {
        isRestoringRef.current = false;
        if (animFrameRef.current) {
          window.cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      }
    };

    window.addEventListener('wheel', onUserInteract, { passive: true });
    window.addEventListener('touchmove', onUserInteract, { passive: true });
    window.addEventListener('pointerdown', onUserInteract, { passive: true });
    window.addEventListener('keydown', onUserInteract, { passive: true });

    return () => {
      window.removeEventListener('wheel', onUserInteract);
      window.removeEventListener('touchmove', onUserInteract);
      window.removeEventListener('pointerdown', onUserInteract);
      window.removeEventListener('keydown', onUserInteract);
    };
  }, []);

  // Passive scroll listener to continuously track scroll position for current history entry
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scheduled = false;
    const onScroll = () => {
      if (!scheduled) {
        window.requestAnimationFrame(() => {
          // If automated smooth restoration is actively gliding, don't overwrite target position with in-flight coordinates
          if (!isRestoringRef.current) {
            const y = window.scrollY || document.documentElement.scrollTop || 0;
            const { key: curKey, pathname: curPath } = currentLocationRef.current;
            persistScrollPosition(curKey, curPath, y);

            // If user is on a course overview page, continuously preserve its position
            if (curPath.startsWith('/subjects/') && !curPath.includes('/quiz')) {
              const slug = curPath.replace(/^\/subjects\/?/, '').split('/')[0];
              if (slug && y > 0) {
                preserveCourseScroll(slug, curKey, y);
              }
            }
          }
          scheduled = false;
        });
        scheduled = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean up any ongoing smooth restoration animation from a previous route
    if (animFrameRef.current) {
      window.cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Save previous page's scroll position right before transitioning, ONLY if not already saved.
    // Crucial: When unmounting a tall page to open a shorter quiz, the browser automatically clamps
    // window.scrollY down before useLayoutEffect fires. Never overwrite a recorded position with a clamped value!
    if (prevLocationRef.current) {
      const existing = getSavedScrollPosition(prevLocationRef.current.key, null);
      if (existing === null || existing === undefined) {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        if (currentY > 0) {
          persistScrollPosition(
            prevLocationRef.current.key,
            prevLocationRef.current.pathname,
            currentY
          );
        }
      }
    }
    prevLocationRef.current = { key, pathname };

    // 1. If anchor hash exists (e.g. #modes, #architecture), scroll directly to anchor element
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // 2. Page Reload & Direct Load Detection on Initial Mount
    const isInitialMount = isInitialMountRef.current;
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    }

    const docNavType = getDocumentNavigationType();
    const isReload = docNavType === 'reload';
    const isDirectLoad = docNavType === 'navigate';

    // On page reload or direct URL load upon initial mount, always start at the top (scrollY = 0)
    if (isInitialMount && (isReload || isDirectLoad)) {
      isRestoringRef.current = false;
      applyInstantScroll(0);

      // On a full document reload, reset saved position for this entry
      if (isReload) {
        if (key) {
          persistScrollPosition(key, pathname, 0);
        }
        if (pathname.startsWith('/subjects/') && !pathname.includes('/quiz')) {
          const courseSlug = pathname.replace(/^\/subjects\/?/, '').split('/')[0];
          if (courseSlug) {
            courseSourceScrollStore.delete(courseSlug);
            try {
              const stored = getStoredPositions();
              delete stored[`course:${courseSlug}`];
              sessionStorage.setItem('mooc_scroll_positions', JSON.stringify(stored));
            } catch (e) {}
          }
        }
      }
      return;
    }

    // 3. Determine target scroll position and navigation mode for in-app transitions
    const isPop = navigationType === 'POP';
    const isInternalBack = !!(state?.restoreScroll || state?.isBackNav);

    let targetY = 0;

    if (isPop || isInternalBack) {
      // Layer 1: Check by current history key
      const savedByKey = key ? getSavedScrollPosition(key, null) : null;
      if (typeof savedByKey === 'number' && savedByKey > 0) {
        targetY = savedByKey;
      }

      // Layer 2: Check targetKey from navigation state
      if (targetY === 0 && state?.targetKey) {
        const savedByTargetKey = getSavedScrollPosition(state.targetKey, null);
        if (typeof savedByTargetKey === 'number' && savedByTargetKey > 0) {
          targetY = savedByTargetKey;
        }
      }

      // Layer 3: Check targetScrollY from navigation state
      if (targetY === 0 && typeof state?.targetScrollY === 'number' && state.targetScrollY > 0) {
        targetY = state.targetScrollY;
      }

      // Layer 4: Check dedicated course source scroll (when returning to a course overview page)
      if (targetY === 0 && pathname.startsWith('/subjects/') && !pathname.includes('/quiz')) {
        const courseSlug = pathname.replace(/^\/subjects\/?/, '').split('/')[0];
        const preserved = getPreservedCourseScroll(courseSlug);
        if (preserved && typeof preserved.y === 'number' && preserved.y > 0) {
          targetY = preserved.y;
        }
      }

      // Layer 5: Fallback by pathname
      if (targetY === 0) {
        const savedByPath = getSavedScrollPosition(null, pathname);
        if (typeof savedByPath === 'number' && savedByPath > 0) {
          targetY = savedByPath;
        }
      }
    } else {
      // Forward PUSH navigation to new page -> always start at top
      targetY = 0;
    }

    // Edge Case: If target is already at the top (<= 15px), stay at top instantly with no animation
    if (targetY <= 15) {
      isRestoringRef.current = false;
      applyInstantScroll(0);
      return;
    }

    // Edge Case: Respect prefers-reduced-motion
    if (isReducedMotionPreferred()) {
      isRestoringRef.current = false;
      applyInstantScroll(targetY);
      return;
    }

    // 3. Smooth Restoration:
    // First, place destination page at the top (0) instantly so it opens visible at the top
    applyInstantScroll(0);
    isRestoringRef.current = true;

    // Schedule smooth downward scroll once initial DOM frame is painted
    let waitFrames = 0;
    const maxWaitFrames = 10; // wait up to ~160ms for dynamic cards/layout to compute height

    const initiateSmoothRestoration = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      // If document layout hasn't expanded to target height yet, wait for dynamic modules to mount
      if (maxScroll < targetY && waitFrames < maxWaitFrames) {
        waitFrames++;
        animFrameRef.current = window.requestAnimationFrame(initiateSmoothRestoration);
        return;
      }

      // Clamp target to available scrollable height
      const clampedY = Math.min(targetY, maxScroll);
      if (clampedY <= 15) {
        isRestoringRef.current = false;
        return;
      }

      // Smooth downward glide to saved position
      window.scrollTo({
        top: clampedY,
        left: 0,
        behavior: 'smooth'
      });

      // Monitor smooth scroll arrival and handle any late layout expansion
      let lastScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      let stationaryFrames = 0;

      const trackArrival = () => {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        const currentMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const currentTarget = Math.min(targetY, currentMax);

        // Reached destination
        if (Math.abs(currentY - currentTarget) <= 4) {
          isRestoringRef.current = false;
          return;
        }

        // Detect if smooth scroll settled
        if (Math.abs(currentY - lastScrollY) < 1) {
          stationaryFrames++;
          if (stationaryFrames > 8) {
            // If layout expanded further during glide and stopped short, adjust to final target
            if (currentY < currentTarget && Math.abs(currentY - currentTarget) > 10) {
              window.scrollTo({
                top: currentTarget,
                left: 0,
                behavior: 'smooth'
              });
              stationaryFrames = 0;
            } else {
              isRestoringRef.current = false;
              return;
            }
          }
        } else {
          stationaryFrames = 0;
        }

        lastScrollY = currentY;

        if (isRestoringRef.current) {
          animFrameRef.current = window.requestAnimationFrame(trackArrival);
        }
      };

      animFrameRef.current = window.requestAnimationFrame(trackArrival);
    };

    // Double rAF ensures the browser paints the top of the destination page before gliding down
    animFrameRef.current = window.requestAnimationFrame(() => {
      animFrameRef.current = window.requestAnimationFrame(initiateSmoothRestoration);
    });

  }, [pathname, search, hash, key, navigationType, state]);

  return null;
}
