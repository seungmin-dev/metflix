import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Router/Home";
import Search from "./Router/Search";
import Tv from "./Router/Tv";
import { ReactQueryDevtools } from "react-query/devtools";

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
      <ReactQueryDevtools />
    </>
  );
}

export default App;
