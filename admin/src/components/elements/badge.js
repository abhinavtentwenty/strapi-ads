// @ts-nocheck
import styled from 'styled-components';

export const Badge = styled.span`
  display: inline-block;
  width: fit-content;
  padding: 6px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 6px;
  text-transform: uppercase;
  background: ${({ $variant }) =>
    $variant === 'active' || $variant === 'live'
      ? '#eafbe7'
      : $variant === 'inactive'
        ? '#fdf4dc'
        : $variant === 'draft'
          ? '#f6f6f9'
          : ''};
  border: ${({ $variant }) => ($variant === 'grayOutline' ? '2px solid #eaeaea' : '')};
  color: ${({ $variant }) =>
    $variant === 'active' || $variant === 'live'
      ? '#5cb176'
      : $variant === 'inactive'
        ? '#f29d41'
        : $variant === 'draft' || $variant === 'grayOutline'
          ? '#8e8ea9'
          : ''};
`;
