import React, { Component } from "react";
import ElectionForm from "./ElectionForm";
import Fade from "@material-ui/core/Fade";

class EditElectionView extends Component {
  render() {
    return (
      <Fade>
        <ElectionForm edit id={this.props.match.params.id} />
      </Fade>
    );
  }
}

export default EditElectionView;
