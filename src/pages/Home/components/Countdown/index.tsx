import { useContext, useEffect, useState } from "react";
import { CountdowContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../..";

export function Countdown() {
  const { activeCycle, activeCycleId } = useContext(CyclesContext);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `Timer - ${activeCycle.task} restam: ${minutes}:${seconds}`;
    }

    return () => {
      document.title = "Timer";
    };
  }, [minutes, seconds, activeCycle]);

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        // como o segundo do set interval não é preciso, nos vamos utilizar o difference in seconds do date fns para o calculo, para isso precisamos passar primeiro a data atual e em sequencia a data de inicio como está a baixo
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return {
                  ...cycle,
                  finishedDate: new Date(),
                };
              } else {
                return cycle;
              }
            })
          );
          setAmountSecondsPassed(totalSeconds);

          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    // dentro do useEffect podemos ter um retorno e esse retorno será uma função, ela tem a responsabilidade de limpar o que foi feito a cima, e para iniciar um ciclo novo direito vamos ter que remover o antigo
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  return (
    <CountdowContainer>
      {/* vamos trabalhar com string como se fosse vetores, fazendo isso pegamos a primeira letra */}
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdowContainer>
  );
}