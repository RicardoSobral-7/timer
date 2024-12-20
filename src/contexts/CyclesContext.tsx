import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { addNewCyclesAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { differenceInSeconds } from "date-fns";
// vamos criar aqui uma interface nova, para caso um dia mudemos a forma de validação que é pelo zod não sofremos muitos problemas, então por esse motivo é recriado

interface CreateCycleData {
  task: string;
  minutesAmount: number;
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


export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // o setCycles, ele vai ser metodo para disparar ações e não mais alterar diretamente o valor de   cycles, então vamos mudar esse nome para dispatch
  // o state, é o valor real (no momento) do nosso estado e uma, ele pode receber diversas informações
  // action, ela é qual ação o usuário ta querendo utilizar de alteração dentro da nossa variável, ações que o usuário pode fazer para alterar esse nosso "estádo"
  // e há um terceiro parametro que é uma função que é disparada assim que o reducer for criado, para recuperar os dados iniciais do reducer
  const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
      cycles: [],
      activeCycleId: null
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem('@timer:cycles-state-1.0.0')

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
      // retorna extamente o tipo que precisamos, vindo direto do parametro da função
      return initialState
    }
  );



  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle: Cycle) => cycle.id === activeCycleId);

  // podemos passar uma função para o estado e setar diferentes tipos de inicio para ele
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate)
      );
    }

    return 0
  });



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
    dispatch(addNewCyclesAction(newCycle));
    // aqui a baixo vamos colocar 0 para que o ciclo não comece onde o anterior parou, isso resolve um bug, se não nunca voltaria do inicio a contagem
    setAmountSecondsPassed(0);
    // tiramos o reset daqui para coloca rna home, pois o contexto deve depender apenas dele e não de nenhuma biblioteca
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

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
