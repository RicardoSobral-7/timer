import { Circle } from "phosphor-react";
import { createContext, ReactNode, useReducer, useState } from "react";
// vamos criar aqui uma interface nova, para caso um dia mudemos a forma de validação que é pelo zod não sofremos muitos problemas, então por esse motivo é recriado

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

// React node é qualquer html valido
interface CyclesContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // o setCycles, ele vai ser metodo para disparar ações e não mais alterar diretamente o valor de   cycles, então vamos mudar esse nome para dispatch
  // o state, é o valor real (no momento) do nosso estado e uma, ele pode receber diversas informações
  // action, ela é qual ação o usuário ta querendo utilizar de alteração dentro da nossa variável, ações que o usuário pode fazer para alterar esse nosso "estádo"
  const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
    switch (action.type) {
      case "ADD_NEW_CYCLE":
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id
        };

      case "INTERRUPT_CURRENT_CYCLE":
        return {
          ...state,
          activeCycleId: null,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return {
                ...cycle,
                interruptDate: new Date(),
              };
            } else {
              return cycle;
            }
          })
        }
      case "MARK_CURRENT_CYCLE_AS_FINISHED":
        return {
          ...state,
          activeCycleId: null,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, finishedDate: new Date() }
            } else {
              return cycle
            }
          })
        }
      default:
        return state
    }
  },
    {
      cycles: [],
      activeCycleId: null
    }
  );
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle: Cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsFinished() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISHED",
      payload: {
        activeCycleId,
      },
    });
  }

  // vamos criar um proxy, uma função que chama outra função
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    // quando o dispatch é chamado, a função la no reducer vai ser executada, e a função que vamos passar como argumento do dispatch ela vai ser executada, ela será o action
    // é comum que para a utilização do reducer nos enviemos um objeto, dentro dele um type, contendo o nome da função/ação em caixa alta, e em sequencia o payload
    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      },
    });
    // aqui a baixo vamos colocar 0 para que o ciclo não comece onde o anterior parou, isso resolve um bug, se não nunca voltaria do inicio a contagem
    setAmountSecondsPassed(0);
    // tiramos o reset daqui para coloca rna home, pois o contexto deve depender apenas dele e não de nenhuma biblioteca
  }

  function interruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId,
      },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
