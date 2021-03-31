import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {
    Chart,
    PieSeries,
    BarSeries,
    Legend,
    Title,
    Tooltip,
    ArgumentAxis,
    ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { EventTracker, Animation } from "@devexpress/dx-react-chart";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

class ResultsView extends Component {
    state = {};
    constructor(props) {
        super(props);
        this.state = { data: {}, loading: true, error: false };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        axios
            .get(
                `http://localhost:5000/api/election/${this.props.match.params.id}/result`,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                const results = [];
                for (let c in response.data.results) {
                    results.push({
                        name: response.data.results[c]["name"],
                        votes: parseInt(response.data.results[c]["votes"]),
                    });
                }
                this.setState({ data: results, loading: false, error: false });
            })
            .catch((error) => {
                this.setState({ error: true });
            });
    }

    render() {
        if (this.state.error) {
            return (
                <Container maxWidth="md">
                    <Typography variant="h5">Results not available </Typography>
                    <Typography>
                        If you believe this is an error, contact your
                        organization's administrator.
                    </Typography>
                </Container>
            );
        }
        if (this.state.loading) {
            return (
                <Container maxWidth="md">
                    <CircularProgress />
                </Container>
            );
        }
        return (
            <Container maxWidth="md">
                <Paper>
                    <Chart data={this.state.data}>
                        <PieSeries valueField="votes" argumentField="name" />
                        <Legend />
                        <Title text="UTMSU Vice-President" />
                        <EventTracker />
                        <Tooltip />
                        <Animation />
                    </Chart>
                    <Chart data={this.state.data} rotated>
                        <ArgumentAxis />
                        <ValueAxis />
                        <BarSeries valueField="votes" argumentField="name" />
                        {/* <Title text="UTMSU Vice President Election"/> */}
                        <EventTracker />
                        <Tooltip />
                        <Animation />
                    </Chart>
                </Paper>
            </Container>
        );
    }
}

export default ResultsView;
