import React, { Component } from "react";

interface BaseComponentProps {
  title: string;
}

interface DerivedComponentProps extends BaseComponentProps {
  content: string;
}

class BaseComponent extends Component<BaseComponentProps> {
  renderTitle() {
    return <h1>{this.props.title}</h1>;
  }

  render() {
    return <div>{this.renderTitle()}</div>;
  }
}

class DerivedComponent extends Component<DerivedComponentProps> {
  renderTitle() {
    return super.renderTitle();
  }

  renderContent() {
    return <p>{this.props.content}</p>;
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        {this.renderContent()}
      </div>
    );
  }
}

export default DerivedComponent;
