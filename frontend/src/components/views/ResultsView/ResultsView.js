import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
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
import { Redirect } from "react-router";

const data = [
    { candidate: "Shubh Bapna", votes: 4 },
    { candidate: "Henry Lin", votes: 3 },
    { candidate: "Chloe Lin", votes: 2 },
    { candidate: "Shivangi Pathak", votes: 1 },
];

async function stall(stallTime = 3000) {
    await new Promise((resolve) => setTimeout(resolve, stallTime));
}

class ResultsView extends Component {
    state = {};
    constructor(props) {
        super(props);
        this.state = { data: data, loading: true };
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        axios
            .get(
                `http://localhost:5000/api/election/${this.props.match.params.id}/result`,
                {
                    withCredentials: true,
                }
            )
            .then(async (response) => {
                console.log(response);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <Container maxWidth="md">
                    <CircularProgress />
                </Container>
            );
        }
        if (this.state.data === {}) {
            return <Redirect to="/elections" />;
        }
        return (
            <Container maxWidth="md">
                <Paper>
                    <Chart data={this.state.data}>
                        <PieSeries
                            valueField="votes"
                            argumentField="candidate"
                        />
                        <Legend />
                        <Title text="UTMSU Vice President Election" />
                        <EventTracker />
                        <Tooltip />
                        <Animation />
                    </Chart>
                    <Chart data={this.state.data} rotated>
                        <ArgumentAxis />
                        <ValueAxis />
                        <BarSeries
                            valueField="votes"
                            argumentField="candidate"
                        />
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
