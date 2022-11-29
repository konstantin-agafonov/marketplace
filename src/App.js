import Explore from "./pages/explore";
import Offers from "./pages/offers";
import {Route,Routes} from "react-router-dom";
import Profile from "./pages/profile";
import Forgotpassword from "./pages/forgotpassword";
import Navbar from "./components/navbar";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import PrivateRoute from "./components/privateroute";
import Category from "./pages/category";

function App() {
  return (
      <>
          <Routes>
              <Route index element={<Explore/>}/>
              <Route path='/offers' element={<Offers/>}/>
              <Route path='/profile' element={<PrivateRoute/>}>
                  <Route path='/profile' element={<Profile/>}/>
              </Route>
              <Route path='/sign-in' element={<SignIn/>}/>
              <Route path='/sign-up' element={<SignUp/>}/>
              <Route path='/forgot-password' element={<Forgotpassword/>}/>
              <Route path='/category/:categoryName' element={<Category/>}/>
          </Routes>
          <Navbar/>
      </>
  );
}

export default App;
