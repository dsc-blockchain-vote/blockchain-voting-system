import React, { Component } from "react";
import ElectionForm from "./ElectionForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import parseISO from "date-fns/parseISO";
import Typography from "@material-ui/core/Typography/Typography";

class EditElectionView extends Component {
    render() {
        return (
            <Fade>
                <ElectionForm edit id={this.props.match.params.id}/>
            </Fade>
        );
    }
}

export default EditElectionView;
