import { useAuth } from "../context/AuthContext";
import ReportList from "../components/ReportList";
import {
  Container,
  Content,
  Header,
  Stack,
  Button,
  Heading,
  Navbar,
} from 'rsuite';

const Dashboard = () => {
  const { role, user, logout } = useAuth();

  return (
    <Container>
      <Header className="page-header">
        <Stack justifyContent="space-between" alignItems="center" color="white" style={{ padding: '2rem', backgroundColor: '#BBBBBB' }}>
          {role === "admin" ? (<Heading level={4}>Admin Dashboard</Heading>) : (
            <Heading level={4}>Viwer Dashboard</Heading>)}
          <Stack direction='row'>
            <Heading level={5} style={{ marginRight: 10 }}>{user}</Heading>
            <Button appearance="ghost" onClick={logout}>Logout</Button>
          </Stack>
        </Stack>
      </Header>
      <Content>
        <ReportList />
      </Content>
    </Container >
  );
};

export default Dashboard;
