import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signin from "./components/signin/signin";
import Signup from "./components/signup/signup";

const App = () => {
	return (
		<Router>
			<Switch>
				{/* <Route path="/" exact component={Welcome} /> */}
				<Route path="/signin" exact component={Signin} />
				<Route path="/signup" exact component={Signup} />
			</Switch>
		</Router>
	);
};

export default App;
