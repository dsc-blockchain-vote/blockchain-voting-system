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

const data = [
    { candidate: "Candidate 1", votes: 1234 },
    { candidate: "Candidate 2", votes: 643 },
    { candidate: "Candidate 3", votes: 636 },
    { candidate: "Candidate 4", votes: 320 },
  ];

class ResultsView extends Component {
    state = {  }
    render() { 
        return (
            <Container maxWidth="md">
                <Paper>
                    <Chart data={data}>
                        <PieSeries valueField="votes" argumentField="candidate" />
                        <Legend/>
                        <Title text="Election Title"/>
                        <EventTracker/>
                        <Tooltip/>
                        <Animation/>
                    </Chart>
                    <Chart data={data} rotated>
                        <ArgumentAxis/>
                        <ValueAxis/>
                        <BarSeries valueField="votes" argumentField="candidate" />
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