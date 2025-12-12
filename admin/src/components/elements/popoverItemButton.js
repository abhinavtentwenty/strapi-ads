import styled from 'styled-components';

const PopoverItemButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  background: ${({ theme }) => theme.colors.neutral0};
  &:hover {
    background: ${({ theme }) => theme.colors.primary100};
  }
  &:active {
    background: ${({ theme }) => theme.colors.primary200};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default PopoverItemButton;
