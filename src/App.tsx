import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";
import Home from "./Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

const LoginForm = () => {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>,
    action: "signIn" | "signUp"
  ) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    const form = event.currentTarget.form;

    if (form) {
      const formData = new FormData(form);
      let response = null;

      if (action === "signIn") {
        response = await signIn(formData);
      } else if (action === "signUp") {
        response = await signUp(formData);
      }

      if (response && response.error) {
        setMessage("メールアドレス、またはパスワードが違います");
        setIsError(true);
      } else {
        if (action === "signIn") {
          navigate("/home");
        } else {
          setMessage(
            "登録が完了しました。送付されたメールを確認して、アカウントの認証を行ってください。"
          );
        }
      }
    } else {
      console.error("Form not found");
    }
  };

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  return (
    <div className="container">
      <nav>
        <div>
          <p className="title">Attendly デモVer</p>
        </div>
        <p className="sub-title">勤怠管理アプリ</p>
      </nav>
      <div className="main-form">
        {message && (
          <div className={isError ? "error-message" : "message"}>{message}</div>
        )}
        <form>
          <label htmlFor="email">メールアドレス</label>
          <input
            className="form-input"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label htmlFor="password">パスワード</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button
            onClick={(e) => handleSubmit(e, "signIn")}
            className="form-button"
          >
            ログイン
          </button>
          <button
            onClick={(e) => handleSubmit(e, "signUp")}
            className="form-button"
          >
            新規登録
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
