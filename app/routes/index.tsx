import { Link } from "remix";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <h1>Remix Notes App</h1>
      {user ? (
        <Link to="/notes">Check your notes</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
