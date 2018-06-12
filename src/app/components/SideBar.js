import React 			from 'react';

class SideBar extends React.Component {
    
    constructor(props) {
	    super(props);
	}

    render(){
        return(
            <div class="fixed-sidebar-left">
                <ul class="nav navbar-nav side-nav nicescroll-bar">
                    <li>
                        <a href="widgets.html"><div class="pull-left"><i class="zmdi zmdi-account mr-20"></i><span class="right-nav-text">Retrait de cash</span></div><div class="pull-right"></div><div class="clearfix"></div></a>
                    </li>
                </ul>
            </div>
        )
    }
}

export default SideBar;