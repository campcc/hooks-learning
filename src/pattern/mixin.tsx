
import React from "react";

const LoggingMixin = {
  componentDidMount() {
    console.log(`${this.constructor.displayName} mounted`);
  },

  componentWillUnmount() {
    console.log(`${this.constructor.displayName} unmount`);
  },
};

const MyComponent = React.createClass({
  displayName: "MyComponent",

  mixins: [LoggingMixin],

  render() {
    return (
      <div>
        <h1>This is a component</h1>
      </div>
    );
  },
});