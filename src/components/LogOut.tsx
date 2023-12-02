import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Button
      onClick={handleLogout}
      borderRadius={5}
      type="submit"
      width="full"
      style={{
        background: "linear-gradient(45deg, blue, purple)",
        color: "white",
        marginInlineEnd: "inherit",
        maxWidth: "115px",
      }}
    >
      ログアウト
    </Button>
  );
};

export default Logout;
