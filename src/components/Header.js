import React, { Component } from "react";
import Typical from "react-typical";
import Switch from "react-switch";

class Header extends Component {
  titles = [];

  constructor() {
    super();
    this.state = { 
      checked: false,
      visitors: null // Step 1: Add state to store the number of visitors
    };
    this.onThemeSwitchChange = this.onThemeSwitchChange.bind(this);
  }

  async componentDidMount() {
    await this.updateCounter(); // Step 2: Fetch the data when the component mounts
  }

  async updateCounter() {
    // Step 3: Fetch data from the Lambda function
    try {
      let response = await fetch(
        "https://5kftrnnr5h7sfazsdnclclax6a0rnevc.lambda-url.ap-northeast-2.on.aws/"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      console.log("Fetched data:", data); // Debug: Log the fetched data
      console.log("Type of data:", typeof data); // Log the type of data

      // Use the data directly as it is a number
      const visitorsCount = Number(data);
      if (!isNaN(visitorsCount)) {
        this.setState({ visitors: visitorsCount }); // Store the number of visitors in state
      } else {
        console.error("Invalid visitors count:", data);
      }
    } catch (error) {
      console.error("Error fetching visitor count:", error);
    }
  }

  onThemeSwitchChange(checked) {
    this.setState({ checked });
    this.setTheme();
  }

  setTheme() {
    var dataThemeAttribute = "data-theme";
    var body = document.body;
    var newTheme =
      body.getAttribute(dataThemeAttribute) === "dark" ? "light" : "dark";
    body.setAttribute(dataThemeAttribute, newTheme);
  }

  render() {
    if (this.props.sharedData) {
      var name = this.props.sharedData.name;
      this.titles = this.props.sharedData.titles.map(x => [ x.toUpperCase(), 1500 ] ).flat();
    }

    const HeaderTitleTypeAnimation = React.memo(() => {
      return <Typical className="title-styles" steps={this.titles} loop={50} />;
    }, (props, prevProp) => true);

    return (
      <header id="home" style={{ height: window.innerHeight - 140, display: 'block' }}>
        <div className="row aligner" style={{height: '100%'}}>
          <div className="col-md-12">
            <div>
              <span className="iconify header-icon" data-icon="la:laptop-code" data-inline="false"></span>
              <br/>
              <h1 className="mb-0">
                <Typical steps={[name]} wrapper="p" />
              </h1>
              <div className="title-container">
                <HeaderTitleTypeAnimation />
              </div>
              <Switch
                checked={this.state.checked}
                onChange={this.onThemeSwitchChange}
                offColor="#baaa80"
                onColor="#353535"
                className="react-switch mx-auto"
                width={90}
                height={40}
                uncheckedIcon={
                  <span
                    className="iconify"
                    data-icon="twemoji:owl"
                    data-inline="false"
                    style={{
                      display: "block",
                      height: "100%",
                      fontSize: 25,
                      textAlign: "end",
                      marginLeft: "20px",
                      color: "#353239",
                    }}
                  ></span>
                }
                checkedIcon={
                  <span
                    className="iconify"
                    data-icon="noto-v1:sun-with-face"
                    data-inline="false"
                    style={{
                      display: "block",
                      height: "100%",
                      fontSize: 25,
                      textAlign: "end",
                      marginLeft: "10px",
                      color: "#353239",
                    }}
                  ></span>
                }
                id="icon-switch"
              />
              {/* Step 4: Render the number of visitors */}
              {this.state.visitors !== null && (
                <div
                  style={{
                    backgroundColor: 'inherit',
                    color: 'black',
                    fontWeight: 'bolder',
                    marginTop: '10px',
                    fontSize: '1.9rem', // Increase the font size
                  }}
                >
                  Visitors🙈👀: {this.state.visitors}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
