import React, { useState } from "react";
import {
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { NavLink as RRNavLink } from 'react-router-dom';
import '../css/AdminSideBar.css';
import { FaTachometerAlt, FaRegChartBar, FaBars, FaBriefcase, FaComment, FaUser } from 'react-icons/fa';


function AdminSideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const links = [
        { label: 'Dashboard', to: '/admin/dashboard', icon: FaTachometerAlt },
        { label: 'Insights', to: '/admin/insights', icon: FaRegChartBar },
        { label: 'Workers', to: '/admin/worker-list', icon: FaBriefcase },
        { label: 'Clients', to: '/admin/client-list', icon: FaUser },
        { label: 'Alerts', to: '/admin/alerts', icon: FaComment },

    ]

    return (
        <>
            <Nav vertical className={`SideNav ${isCollapsed ? "collapsed" : ""}`}>
                <div className="sidenav-top-space">
                    <FaBars className="hamburger-icon" onClick={()=> setIsCollapsed(!isCollapsed)} size="27"/>
                </div>
                
                {links.map((link) => (
                    <AdminSideBar.NavItem to={link.to} collapsed={isCollapsed}>
                        <link.icon size="25"/>
                        <span>{link.label}</span>
                    </AdminSideBar.NavItem>
                ))}
            </Nav>
        </>
    );
}

AdminSideBar.NavItem = (props) => (
    <NavItem className={`sidenav-item ${props.collapsed && "collapsed-link"}`}>
        <NavLink className="sidenav-link" activeClassName="active" tag={RRNavLink} to={props.to}>
            {props.children}
        </NavLink>
    </NavItem>
)

export default AdminSideBar;
