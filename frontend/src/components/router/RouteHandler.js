import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import ElectionFormView from '../views/ElectionFormView/ElectionFormView';
import ElectionListView from '../views/ElectionListView/ElectionListView';
import ResultsView from "../views/ResultsView/ResultsView";

export default function RouteHandler() {
    return (
        <Switch>
            <Route exact path="/" component={ElectionListView}/>
            <Route path="/ballot" component={BallotView}/>
            <Route exact path="/elections" component = {ElectionListView}/>
            <Route exact path="/elections/create" component={ElectionFormView}/>
            <Route exact path="/elections/:id" component = {ElectionFormView}/>
            <Route exact path="/elections/:id/results" component = {ResultsView}/>
        </Switch>
    )
}
