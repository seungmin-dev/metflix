import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Router/Home";
import Search from "./Router/Search";
import Tv from "./Router/Tv";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route
            path={["/search", "/search/movie/:movieId", "/search/tv/:tvId"]}
          >
            <Search />
          </Route>
          <Route path={["/tv", "/tv/:tvId"]}>
            <Tv />
          </Route>
          <Route path={["/", "/movie/:movieId"]}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
