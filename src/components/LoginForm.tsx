import SignUp from "./SignUp";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  InputRightElement,
  chakra,
  Box,
  Link,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdMail } from "react-icons/md";

const CFaLock = chakra(FaLock);
const CFaRegEye = chakra(FaRegEye);
const CFaRegEyeSlash = chakra(FaRegEyeSlash);
const CMdMail = chakra(MdMail);

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const handleShowClick = () => setShowPassword(!showPassword);

  const formStyle = loading ? { opacity: 0.5 } : {};

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setLoginError(false);
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } else {
      setLoading(false);
      setLoginError(true);
    }
  };

  return (
    <>
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.100"
        justifyContent="center"
        alignItems="center"
      >
        {loading && (
          <Flex
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            backgroundColor="rgba(0, 0, 0, 0.4)"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        )}
        <form style={formStyle} onSubmit={handleLogin}>
          <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
          >
            <Heading
              style={{
                background: "linear-gradient(45deg, purple, blue)",
                padding: "20px",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
              color="teal.400"
            >
              ReserveEase
            </Heading>
            <Box minW={{ base: "90%", md: "468px" }}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl>
                  {loginError && (
                    <Alert status="error" marginBottom={5} borderRadius={5}>
                      <AlertIcon />
                      <AlertTitle>ログインエラー</AlertTitle>
                      <AlertDescription>
                        メールアドレスまたはパスワードが違います
                      </AlertDescription>
                    </Alert>
                  )}
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CMdMail color="gray.300" />}
                    />
                    <Input
                      type="email"
                      placeholder="メールアドレス"
                      name="email"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワード"
                      name="password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick}
                        backgroundColor="#f0f0f0"
                      >
                        {showPassword ? <CFaRegEyeSlash /> : <CFaRegEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={5}
                  type="submit"
                  width="full"
                  style={{
                    background: "linear-gradient(45deg, blue, purple)",
                    color: "white",
                  }}
                >
                  ログイン
                </Button>
              </Stack>
            </Box>
          </Stack>
          <Box textAlign="right" onClick={() => setIsSignUp(true)}>
            アカウント登録はこちら→{" "}
            <Link color="teal.500" href="#">
              登録
            </Link>
          </Box>
        </form>
      </Flex>
      <SignUp isOpen={isSignUp} onClose={() => setIsSignUp(false)} />
    </>
  );
};

export default LoginForm;
