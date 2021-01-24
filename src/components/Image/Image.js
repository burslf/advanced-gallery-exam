import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import { indexOf, slice } from 'core-js/fn/array';
import array from 'core-js/fn/array';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
      imageToDrag: null,
      imageToDrop: null
    };
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotatePicture() {
    if(this.state.rotation >= 360) {
      this.setState({rotation: 90})
    } else {
      this.setState({rotation: this.state.rotation + 90})
    }
  }
  
  componentDidMount() {
    // this.setState({position: {x: }})
  }

  render() {
    return (
      <div className="image-container">
      <div
        onDragStart={(e) => {
          this.props.onDrag(e)
        }}
        onDragEnter={(e)=> {
          this.props.onDrop(e)
        }}
        onDragEnd={(e) => {
          this.props.dragAndDrop(e)
        }}
        draggable={true}
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          transform: `rotate(${this.state.rotation}deg)`
        }}
        onClick={() => this.props.expandPicture(this.props.dto)}
      >

      </div>
        <div
            className='tools-div'
            // style={{
            //   transform: `rotate(-${this.state.rotation}deg)` // Keep the tools not rotating
            // }}
        >
          <FontAwesome className="image-icon" onClick={() => this.rotatePicture()} name="sync-alt" title="rotate"/>
          <FontAwesome className="image-icon" onClick={() => this.props.deletePicture(this.props.dto.id)} name="trash-alt" title="delete"/>
          {/* <FontAwesome className="image-icon" onClick={() => this.props.expandPicture(this.props.dto)} name="expand" title="expand"/> */}
        </div>
      </div>
    );
  }
}

export default Image;
