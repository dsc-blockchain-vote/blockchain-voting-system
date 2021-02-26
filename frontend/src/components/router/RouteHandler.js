import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import CreateElectionView from '../views/CreateElectionView/CreateElectionView';
import ElectionListView from '../views/ElectionListView/ElectionListView';

export default function RouteHandler() {
    return (
        <Switch>
            <Route path="/create" component={CreateElectionView}/>
            <Route path="/ballot" component={BallotView}/>
            <Route path="/elections" component = {ElectionListView}/>
        </Switch>
    )
}