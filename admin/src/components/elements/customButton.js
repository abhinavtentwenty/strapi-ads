import styled from 'styled-components';

const CustomButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #dcdce4;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #32324d;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f6f6f9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  svg {
    width: auto;
    height: 1rem;
    path {
      fill: none;
    }
  }
`;

export default CustomButton;
