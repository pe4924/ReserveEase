import { useState, FormEvent } from "react";
import { supabase } from "../supabaseClient";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { MdMail, MdPerson, MdPhone } from "react-icons/md";
import { FaLock } from "react-icons/fa";

type SignUpProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SignUp: React.FC<SignUpProps> = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isError, setIsError] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isCompleteModalOpen,
    onOpen: onCompleteModalOpen,
    onClose: onCompleteModalClose,
  } = useDisclosure();

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setIsError(false);
    setSignUpError(false);

    if (password !== passwordConfirm) {
      setIsError(true);
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setIsLoading(false);

    if (!error && data) {
      try {
        const response = await fetch(
          "http://localhost:8000/register-user-info",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              supabase_id: data.user?.id,
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone_number: phoneNumber,
            }),
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          onCompleteModalOpen();
          onClose();
        } else {
          throw new Error(responseData.message);
        }
      } catch (apiError) {
        setSignUpError(true);
      }
    } else {
      setSignUpError(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx="auto" my="auto">
          <ModalHeader>アカウント登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {signUpError && (
              <Alert status="error" marginBottom={5} borderRadius={5}>
                <AlertIcon />
                <AlertTitle>登録エラー</AlertTitle>
                <AlertDescription>
                  メールアドレスまたはパスワードが違います
                </AlertDescription>
              </Alert>
            )}
            <Flex>
              <FormControl mr={2}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdPerson color="gray.300" />}
                  />
                  <Input
                    placeholder="姓"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdPerson color="gray.300" />}
                  />
                  <Input
                    placeholder="名"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
            </Flex>
            <FormControl mt={4}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<MdPhone color="gray.300" />}
                />
                <Input
                  placeholder="電話番号"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl mt={4}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<MdMail color="gray.300" />}
                />
                <Input
                  placeholder="メールアドレス"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl mt={4} isInvalid={isError}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaLock color="gray.300" />}
                />
                <Input
                  placeholder="パスワード"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl mt={4} isInvalid={isError}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaLock color="gray.300" />}
                />
                <Input
                  placeholder="パスワード（確認用）"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </InputGroup>
              {isError && (
                <FormErrorMessage>パスワードが一致しません</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                background: "linear-gradient(45deg, blue, purple)",
                color: "white",
              }}
              mr={3}
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span style={{ marginLeft: "10px" }}>登録中...</span>
                </>
              ) : (
                "登録"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
        {isLoading && (
          <ModalOverlay style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
        )}
      </Modal>
      <Modal isOpen={isCompleteModalOpen} onClose={onCompleteModalClose}>
        <ModalOverlay />
        <ModalContent mx="auto" my="auto">
          <ModalHeader>登録完了</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            登録が完了しました。メールを確認してアカウント認証を完了させてください。
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                background: "linear-gradient(45deg, blue, purple)",
                color: "white",
              }}
              onClick={onCompleteModalClose}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUp;
