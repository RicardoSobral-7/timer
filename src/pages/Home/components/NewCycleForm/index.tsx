import { useForm } from "react-hook-form";
import { FormContainer, MinutsAmountInput, TaskInput } from "./styles";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// schemaBased  é um formato de validação em cima disso
const newCicleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

// aqui criamos uma tipagem, onde se alterar a cima já criamos uma nova tipagem automática para  nos ajudar a completar as coisas no form
type NewCycleFormData = zod.infer<typeof newCicleFormValidationSchema>;

export function NewCicleForm() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCicleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

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
