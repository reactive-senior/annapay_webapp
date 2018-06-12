import React 			from 'react';
import TopMenu          from './TopMenu';
import SideBar          from './SideBar';
import Cashout          from './Cashout'

class App extends React.Component {
    constructor(props) {
	    super(props);
	}

    render(){
        return(
            <div class="wrapper theme-1-active pimary-color-green">
                <TopMenu firebase={this.props.firebase}/>
                <SideBar/>
                <Cashout/>
            </div>
        )
    }
}

export default App;