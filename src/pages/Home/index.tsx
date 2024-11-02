import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountDownButton,
} from "./styles";
// lib necessária para utilizar o zod como validador
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import * as zod from "zod";
import { CyclesContext } from "../../contexts/CyclesContext";
import { Countdown } from "./components/Countdown";
import { NewCicleForm } from "./components/NewCycleForm";

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

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCicleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    // ele volta os campos do formulário para os valores default
    reset();
  }

  const task = watch("task");

  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        {/* o react hook form tem seu proprio contexto, sendo assim como deveriamos apenas passar o register, podemos passar todo o useForm em uma variavel, passando o contexto dele e usando o spread operator para desestrutrar */}
        <FormProvider {...newCycleForm}>
          <NewCicleForm />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <StopCountDownButton onClick={interruptCurrentCycle} type="button">
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
