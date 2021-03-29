import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import CreateElectionView from '../views/CreateElectionView/CreateElectionView';
import Login from '../views/LoginAndSignupView/Login';
import Signup from '../views/LoginAndSignupView/Signup';
import ElectionListView from '../views/ElectionListView/ElectionListView';
import ResultsView from "../views/ResultsView/ResultsView";
import Profile from '../views/ProfileView/Profile';

export default function RouteHandler() {
    return (
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/create" component={CreateElectionView}/>
            <Route path="/ballot" component={BallotView}/>
            <Route exact path="/elections/:id" component={BallotView}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/profile" component={Profile}/>
            <Route exact path="/elections" component = {ElectionListView}/>
            <Route exact path="/elections/:id" component = {CreateElectionView}/>
            <Route exact path="/elections/:id/results" component = {ResultsView}/>
        </Switch>
    )
}
