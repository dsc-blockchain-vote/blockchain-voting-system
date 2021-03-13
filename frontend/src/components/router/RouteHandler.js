import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import CreateElectionView from '../views/CreateElectionView/CreateElectionView';
import Login from '../views/LoginAndSignupView/Login';
import Signup from '../views/LoginAndSignupView/Signup';
import ElectionListView from '../views/ElectionListView/ElectionListView';

export default function RouteHandler() {
    return (
        <Switch>
            <Route exact path="/" component={ElectionListView}/>
            <Route path="/create" component={CreateElectionView}/>
            <Route path="/ballot" component={BallotView}/>
            <Route exact path="/elections" component={ElectionListView}/>
            <Route exact path="/elections/:id" component={BallotView}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
        </Switch>
    )
}