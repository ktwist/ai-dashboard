import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import ReportList from "../components/ReportList";
import {
  Container,
  Content,
  Header,
  Stack,
  Button,
  Heading,

} from 'rsuite';

const Dashboard = () => {
  const { role, user, logout } = useAuth();

  return (
    <Container>
      <Header className="page-header">
        <Stack direction='row' spacing={10} justifyContent="space-between" alignItems="center">
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
