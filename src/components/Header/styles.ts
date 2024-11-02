import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 25px;
    height: 50px;
  }

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      width: 3rem;
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;

      color: ${(props) => props.theme["gray-100"]};

      /* as bordas são colocadas para não mais fazer o movimento como se ela fosse renderizada somente no momento */
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme["green-500"]};
      }

      /* é criado o active no navlink quando estamos na página */
      &.active {
        color: ${props => props.theme["green-500"]};
      }
    }
  }
`;
