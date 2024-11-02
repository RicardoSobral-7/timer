import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountDownButton,
} from "./styles";
// lib necessária para utilizar o zod como validador
import { differenceInSeconds } from "date-fns";
import { createContext, useEffect, useState } from "react";
import { NewCicleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycle] = useState<string | null>(null);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((prev) => [...prev, newCycle]);
    setActiveCycle(id);
    // aqui a baixo vamos colocar 0 para que o ciclo não comece onde o anterior parou, isso resolve um bug, se não nunca voltaria do inicio a contagem
    setAmountSecondsPassed(0);
    // ele volta os campos do formulário para os valores default
    reset();
  }

  function hadleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptDate: new Date(),
          };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycle(null);
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  const task = watch("task");

  const isSubmitDisabled = !task;

  useEffect(() => {
    if (activeCycle) {
      document.title = `Timer - ${activeCycle.task} restam: ${minutes}:${seconds}`;
    }

    return () => {
      document.title = "Timer";
    };
  }, [minutes, seconds]);

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider value={{ activeCycle }}>
          <NewCicleForm />
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountDownButton onClick={hadleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
