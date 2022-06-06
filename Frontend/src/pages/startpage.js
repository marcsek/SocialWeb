import React from "react";
import "../css/startpage.css";
import { Link } from "react-router-dom";

class StartPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.user == null) {
      console.log("loading");
      return <div>Loading</div>;
    }
    return (
      <div className="container">
        <div className="content-large">
          <Link to="/login">
            <img src="./img/imggg.jfif" alt="img"></img>
            <div className="textblock">
              <h3>{this.props.user.name || "LOGIN"}</h3>
            </div>
          </Link>
        </div>
        <div className="content-large">
          <img src="./img/img.jpg" alt="img"></img>
          <div className="textblock">
            <h3>Sample Text</h3>
          </div>
        </div>

        <div className="content-small">
          <img src="./img/imgg.jpg" alt="img"></img>
          <div className="text">
            <h5>
              Mein Lieblingsplatz ist mein Zimmer. Ich bin am liebsten in dem
              Zimmer, weil ich mich hier sehr gut fuhle. Mein Zimmer ist
              ziemlich groß und räumig. Auf der rechten Seite liegt ein Bett.
              Links ist ein Tisch mit alle dinge, wie ich brauche. Oben ist ein
              regal, mit einige buchen. Ich habe hier auch einen Fernseher. Ich
              sehe von Zeit zu Zeit am Abend fern. An der Wand ist auch eine
              Air-Condition, für warmen Sommertagen. Mein Zimmer ist ein idealer
              Platz für mich.
            </h5>
          </div>
        </div>

        <div className="content-small">
          <img src="./img/fullhd.jpg" alt="img"></img>
          <div className="text">
            <h5>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
              mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
              semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
              porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem
              ante, dapibus in, viverra quis, feugiat a,
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

export default StartPage;
