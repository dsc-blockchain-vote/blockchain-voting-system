import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import {
  Chart,
  PieSeries,
  BarSeries,
  Legend,
  Title,
  Tooltip,
  ArgumentAxis,
  ValueAxis
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, Animation } from '@devexpress/dx-react-chart';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router';

const data = [
    { name: "Candidate 1", votes: 1234 },
    { name: "Candidate 2", votes: 643 },
    { name: "Candidate 3", votes: 636 },
    { candidate: "Candidate 4", votes: 320 },
  ];

class ResultsView extends Component {
    state = {  }
    constructor(props) {
        super(props);
        this.state = {data: {}, loading: true};
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        axios
            .get(`http://localhost:5000/api/election/${this.props.match.params.id}/result`, {
                withCredentials: true,
            })
            .then((response) => {
                console.log(response);
                this.setState({data: response.data, loading: false});
            })
            .catch((error) => {
                console.log(error);
                this.setState({loading: false});
            });
    }

    render() { 
        if (this.state.loading) {
            return (<CircularProgress/>);
        }
        if (this.state.data === {}) {
            return (<Redirect to="/elections"/>);
        }
        return (
            <Container maxWidth="md">
                <Paper>
                    <Chart data={this.state.data.results}>
                        <PieSeries valueField="votes" argumentField="name" />
                        <Legend/>
                        <Title text="Election Title"/>
                        <EventTracker/>
                        <Tooltip/>
                        <Animation/>
                    </Chart>
                    <Chart data={this.state.data.results} rotated>
                        <ArgumentAxis/>
                        <ValueAxis/>
                        <BarSeries valueField="votes" argumentField="name" />
                        <Title text="Election Title"/>
                        <EventTracker/>
                        <Tooltip/>
                        <Animation/>
                    </Chart>
                </Paper>
            </Container>
        );
    }
}
 
export default ResultsView;