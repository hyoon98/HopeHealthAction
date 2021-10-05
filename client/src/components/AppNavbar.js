import React, {useState, useEffect, useContext} from 'react';
import {
UncontrolledDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    NavbarToggler,
    Collapse
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import moment from 'moment';


// Dropdown functionality from:
//https://reactstrap.github.io/components/navbar/

function AppNavbar(props) {
    const context = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [numAlertsToday, setNumAlertsToday] = useState(0);

    useEffect(() => {
        if(context.Role === 'Admin'){
            setIsAdmin(true)
        }

        axios.get('/alerts/worker/' + context.WorkerId)
        .then(response => {
            countTodaysAlerts(response.data);
        })
        .catch(error => {
            console.log(error);
        });

    }, [context])

    function countTodaysAlerts(alerts) {
        const today = moment();

        let count = 0;
        alerts.forEach(alert => {
            if (today.isBetween(alert.Date, alert.Date, 'days', '[]')) {
                count++;
            }
        });
        setNumAlertsToday(count);
    }
    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);
    const size=useWindowSize()
    function useWindowSize() {
        // Initialize state with undefined width/height so server and client renders match
        // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
      
        useEffect(() => {
          // Handler to call on window resize
          function handleResize() {
            // Set window width/height to state
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
          }
          
          // Add event listener
          window.addEventListener("resize", handleResize);
          
          // Call handler right away so state gets updated with initial window size
          handleResize();
          
          // Remove event listener on cleanup
          return () => window.removeEventListener("resize", handleResize);
        }, []); // Empty array ensures that effect is only run on mount
      
        return windowSize;
      }
    return(
        <div>
            <Navbar expand="lg" style={{backgroundColor:"#585858",color:"inherit",marginBottom:"40px",padding:"15px"}}>
            <Container>
                    <Link to={isAdmin ? '/admin/dashboard' : '/'}>
                        <NavbarBrand style={{color:"white"}}> <img src="favicon.ico" style={{display:"inline"}}/>CBR Manager</NavbarBrand>
                    </Link>
                    <NavbarToggler onClick={toggleNavbar} className="me-2 navbar-dark" />
                    <Collapse isOpen={!collapsed} navbar>
                    <Nav className="ml-auto" navbar>
                        {!isAdmin ?
                        <>
                        <NavItem>
                            <Link to="/dashboard" className="nav-link" style={{color:"#c7eabe"}}>
                                Dashboard ({numAlertsToday})
                            </Link>
                        </NavItem>
                        {size.width>=991 ?
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret style={{color:"#c7eabe"}}>Clients</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem tag={Link} to="/client/new">
                                        Add new client
                                </DropdownItem>
                                <DropdownItem tag={Link} to="/client-list"> 
                                        All clients
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        :
                        <>
                        <NavItem>
                            <Link to="/client/new" className="nav-link" style={{color:"#c7eabe"}}>
                                Add new client
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/client-list" className="nav-link" style={{color:"#c7eabe"}}>
                                All clients
                            </Link>
                        </NavItem>
                        </>
                        }
                        </>
                        :""}
                        <NavItem>
                            <Link to="/logout" className="nav-link" style={{color:"#c7eabe"}}>
                                Logout
                            </Link>
                        </NavItem>
                    </Nav>
                    </Collapse>
            </Container>
            </Navbar>
        </div>
    );
}


export default AppNavbar