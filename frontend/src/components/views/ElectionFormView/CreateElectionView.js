import React, { Component } from 'react';
import ElectionForm from './ElectionForm';

class CreateElectionView extends Component {
    render() { 
        return(
            <ElectionForm edit={false}/>
        )
    }
}
 
export default CreateElectionView;