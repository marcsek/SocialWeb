import React from "react";
import Registration from "./registrationPage";
import Login from "./loginpage";
import axios from "axios";

//totototototototototo
class UserPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.successfulAuth = this.successfulAuth.bind(this);
    // this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  successfulAuth(data) {
    this.props.handleLogin(data);
    this.props.history.push("/");
  }

  // handleLogoutClick() {
  //   this.setState(
  //     {
  //       loading: true,
  //     },
  //     () => {
  //       axios
  //         .delete("http://localhost:5001/api/user/logout", {
  //           withCredentials: true,
  //         })
  //         .then((response) => {
  //           localStorage.clear();
  //           this.props.handleLogout();
  //           // this.props.history.push("/");
  //           this.setState({
  //             loading: false,
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           this.setState({
  //             loading: false,
  //           });
  //         });
  //     }
  //   );
  // }

  render() {
    return (
      <div>
        {/* {this.props.loogedInStatus == "LOGGED_IN" ? (
          // <div>
          //   <button onClick={() => this.handleLogoutClick()}>Tu som</button>
          //   {this.state.loading ? <h6>Loading</h6> : <h6></h6>}
          // </div>
        ) : ( */}
        <div>
          <Registration successfulAuth={this.successfulAuth} />
          <Login successfulAuth={this.successfulAuth} />
        </div>
        {/* )} */}
      </div>
    );
  }
}

export default UserPage;
