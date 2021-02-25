import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import CreateElectionView from '../views/CreateElectionView/CreateElectionView';
import Login from '../views/LoginView/Login';

export default function RouteHandler() {
    return (
        <Switch>
            <Route path="/create" component={CreateElectionView}/>
            <Route path="/ballot" component={BallotView}/>
            <Route path="/login" component={Login}/>
        </Switch>
    )
}