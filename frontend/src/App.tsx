import "@mantine/core/styles.css";
import {
  AppShell,
  Container,
  Group,
  MantineProvider,
  Title,
} from "@mantine/core";
import { theme } from "./theme";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppShell header={{ height: { base: 60, md: 70, lg: 80 } }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Group>
              <Title order={4}>Passport Checker</Title>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Container>
            <Home />
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
