import styled from 'styled-components';
import { Tab } from '@strapi/design-system';

const TabButton = styled(Tab)`
  padding: 0;
  border: none;
  background: transparent;

  > div {
    padding: 0 !important;
    background: transparent !important;
  }

  &[aria-selected='true'] {
    /* styles for active tab */
    button {
      background: #32324d !important; /* active bg */
      color: #ffffff !important; /* white text */
    }

    /* ensure ALL text + icon parts become white */
    svg,
    svg path,
    span,
    p,
    div {
      color: #ffffff !important;
      fill: #ffffff !important;
    }
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default TabButton;
