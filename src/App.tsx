import { supabase } from "./supabaseClient";

const App = () => {
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>,
    action: "signIn" | "signUp"
  ) => {
    event.preventDefault();
    const form = event.currentTarget.form;

    if (form) {
      // formがnullでないことを確認
      const formData = new FormData(form);
      if (action === "signIn") {
        await signIn(formData);
      } else if (action === "signUp") {
        await signUp(formData);
      }
    } else {
      console.error("Form not found");
    }
  };

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("エラー");
    } else {
      const currentUser = supabase.auth.getUser();
      console.log((await currentUser).data.user?.email);
      alert("成功しました。");
    }
  };

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("登録エラー");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-inner">
          <p className="title">Attendly</p>
        </div>
      </nav>
      <div className="main-form">
        <form>
          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label htmlFor="password">Password</label>
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
            Sign In
          </button>
          <button
            onClick={(e) => handleSubmit(e, "signUp")}
            className="form-button"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
