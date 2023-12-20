import {css} from 'lit';

// language=CSS
export const ShadowStyles = css`
  .shadow.animated.elevate {
    transition-property: box-shadow;
    box-shadow: none;
    will-change: box-shadow;
  }

  .shadow.animated.elevate.clicked {
    box-shadow: none !important;
    background-color: #ddd;
  }

  .shadow.elevate.elevate-1,
  .shadow.elevate.elevated-1:hover {
    box-shadow:
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);
  }

  .shadow.elevate.elevate-2,
  .shadow.elevate.elevated-2:hover {
    box-shadow:
      0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12),
      0 2px 4px -1px rgba(0, 0, 0, 0.4);
  }

  .shadow.elevate.elevate-3,
  .shadow.elevate.elevated-3:hover {
    box-shadow:
      0 16px 24px 2px rgba(0, 0, 0, 0.14),
      0 6px 30px 5px rgba(0, 0, 0, 0.12),
      0 8px 10px -5px rgba(0, 0, 0, 0.4);
  }
`;

// language=CSS
export const AnimatedStyles = css`
  .animated {
    transition-duration: 0.28s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
