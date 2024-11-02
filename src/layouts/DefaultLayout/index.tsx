import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";
import { LayoutContainer } from "./styles";

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      {/* Outlet é um espaço onde pode ser inserido um conteúdo, o react-router-dom quando tiver usando esse layout, ele irá saber onde posicionar o conteúdo desde que exista o outlet no local, agora para usar o layout */}
      <Outlet />
    </LayoutContainer>
  );
}
