import React, { Component } from "react";
import ElectionForm from "./ElectionForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import parseISO from "date-fns/parseISO";

class EditElectionView extends Component {
    state = {
        data: {
            title: "",
            start: null,
            end: null,
            candidates: [],
            voters: [],
            loading: true,
        },
    };

    componentDidMount() {
        this.getData();
    }

    getData() {
        // if we are editing this page:
        if (this.props.match.params.id) {
            const result = axios
                .get(
                    `http://localhost:5000/api/election/${this.props.match.params.id}`,
                    { withCredentials: true }
                )
                .then((response) => {
                    const newState = {};
                    // load data into state
                    newState.title = response.data["electionName"];
                    newState.start = parseISO(response.data["startTime"]);
                    newState.end = parseISO(response.data["endTime"]);
                    // load candidates
                    const importCandidates = [];
                    for (
                        let i = 0;
                        i < response.data["candidates"].length;
                        i++
                    ) {
                        importCandidates.push({
                            id: i,
                            name: response.data["candidates"][i],
                        });
                    }
                    // load voters
                    // const importVoters = [];
                    // for (let i = 0; i < response["validVoters"].length; i++) {
                    //     importVoters.push({id: i, name: response["validVoters"][i]});
                    // }
                    newState.candidates = importCandidates;
                    newState.voters = [];
                    newState.loading = false;
                    this.setState({data: newState}, () => console.log(this.state.data));
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({data: { loading: false }});
                });
        }
    }

    render() {
        console.log(this.state);
        if (this.state.data.loading) {
            return <CircularProgress />;
        }
        return (
            <Fade>
                <ElectionForm edit data={this.state.data} />
            </Fade>
        );
    }
}

export default EditElectionView;
