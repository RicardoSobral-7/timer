import styled from "styled-components";

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) => props.theme["gray-100"]};
  font-size: 1.125rem;
  font-weight: bold;
  /* quando a tela for menor para quebrar em 2 linhas, o wrap irá funcionar pra isso */
  flex-wrap: wrap;
`;

// para quando 2 componentes divide a mesma base de estilos
export const BaseInput = styled.input`
  color: ${(props) => props.theme["gray-100"]};
  background: transparent;
  height: 2.5rem;
  border: 0;
  border-bottom: 2px solid ${(props) => props.theme["gray-500"]};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5;
  /* para herdar alguma estilização que queria do pai, para o filho, podemos usar nos lugares o inherit ele herda do pai */

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme["green-500"]};
  }

  &::placeholder {
    color: ${(props) => props.theme["gray-500"]};
  }
`;

export const TaskInput = styled(BaseInput)`
  /*  o flex 1 ele é um atalho para setar 3 propriedades, flex grow faz o componente crescer além do original, flex shrink  o componente diminui o tamanho menor que o permitido , flex basis esse é o meio termo entre eles, ele cabe no espaço que houver */
  flex: 1;

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`;

export const MinutsAmountInput = styled(BaseInput)`
  width: 4rem;
`;