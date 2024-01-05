import { Navbar as FlowbiteNavbar } from 'flowbite-react';
import { useCookies } from 'react-cookie';

function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);                                                   
                                                                                                                       
  const logout = () => {                                                                                              
    setCookie("token", "", { path: "/" });                                                                            
    removeCookie(["token"]);                                                                                          
    window.location.reload();                                                                                         
  };
  return (
    <FlowbiteNavbar fluid rounded>
      <FlowbiteNavbar.Brand href="https://flowbite-react.com">
        <img src="/src/assets/icon.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Sunrise AI</span>
      </FlowbiteNavbar.Brand>
      <FlowbiteNavbar.Toggle />
      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link href="/dashboard" active>
          Dashboard
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#">
          About
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#">Services</FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#">Pricing</FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#">Contact</FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#" onClick={logout}>Logout</FlowbiteNavbar.Link>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
}

export default Navbar;
