import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import CreateElectionView from '../views/CreateElectionView/CreateElectionView';
import ElectionListView from '../views/ElectionListView/ElectionListView';
import ResultsView from "../views/ResultsView/ResultsView";

export default function RouteHandler() {
    return (
        <Switch>
            <Route path="/create" component={CreateElectionView}/>
            <Route path="/ballot" component={BallotView}/>
            <Route exact path="/elections" component = {ElectionListView}/>
            <Route exact path="/elections/:id" component = {CreateElectionView}/>
            <Route exact path="/elections/:id/results" component = {ResultsView}/>
        </Switch>
    )
}