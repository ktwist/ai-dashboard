import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Text,
    Content,
    Form,
    Button,
    Panel,
    Stack,
    VStack,
    Divider,
    Input,
    InputGroup,
    Message,
} from 'rsuite';
import EyeCloseIcon from '@rsuite/icons/EyeClose';
import VisibleIcon from '@rsuite/icons/Visible';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passVisible, setPassVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, password);
        if (!success) setError("Invalid credentials");
    };

    const handlePasswordVisibility = () => {
        setPassVisible(!passVisible);
    };
    return (
        <Content>
            <Stack alignItems="center" justifyContent="center" style={{ height: '100%' }}>
                <Panel shaded bordered header="Sign in" style={{ width: 400 }}>
                    <VStack>
                        <Text>Username</Text>
                        <Input value={username} onChange={value => setUsername(value)} />
                        <Text>Password</Text>
                        <InputGroup inside >
                            <Input value={password} type={passVisible ? 'text' : 'password'} onChange={value => setPassword(value)} />
                            <InputGroup.Button onClick={handlePasswordVisibility}>
                                {passVisible ? <VisibleIcon /> : <EyeCloseIcon />}
                            </InputGroup.Button>
                        </InputGroup>
                        <Button appearance="primary" block onClick={handleSubmit} style={{ marginTop: 10 }}>
                            Sign in
                        </Button>
                        <Divider>Sample Users</Divider>
                        <Text>
                            admin123 or user/user123
                        </Text>
                    </VStack>
                    {error && <Message type="error">
                        <Text>{error}</Text>
                    </Message>}
                </Panel>
            </Stack>
        </Content>
    );
};

export default Login;