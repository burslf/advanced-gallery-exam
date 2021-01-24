import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art'
    };
  }
 


  render() {
    return (
      <div className="app-root"
      >
        <div className="app-header">
          <div className="logo">
          <h2>Flickr Gallery</h2>
          </div>
          <div className="search">
          <input className="app-input" placeholder="type to search" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
          </div>
        </div>
          <Gallery tag={this.state.tag}/>
      </div>
    );
  }
}

export default App;
