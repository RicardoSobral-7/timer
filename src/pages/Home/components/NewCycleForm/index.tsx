import { useContext } from "react";
import { FormContainer, MinutsAmountInput, TaskInput } from "./styles";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCicleForm() {
  const { activeCycle } = useContext(CyclesContext);
  // a baixo vamos pegar o contexto que passamos lá na home, no provider
  const { register } = useFormContext();

  return (
    <FormContainer>
      {/* html for ele já da o focus no input com o mesmo id */}
      <label htmlFor="task">Vou Trabalhar em</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="de um nome para sua tarefa"
        list="task-suggestions"
        disabled={!!activeCycle}
        {...register("task")}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
        <option value="Banana" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutsAmountInput
        type="number"
        id="minutesAmount"
        min={5}
        step={5}
        max={60}
        disabled={!!activeCycle}
        {...register("minutesAmount", { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
