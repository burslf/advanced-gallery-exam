import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };
  constructor(props) {
    super(props);
    this.state = {
      rotation: 0,
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

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          transform: `rotate(${this.state.rotation}deg)`
        }}
      >
        <div 
            className='tools-div' 
            style={{
              transform: `rotate(-${this.state.rotation}deg)` // Keep the tools not rotating
            }}
        >
          <FontAwesome className="image-icon" onClick={() => this.rotatePicture()} name="sync-alt" title="rotate"/>
          <FontAwesome className="image-icon" onClick={() => this.props.deletePicture(this.props.dto.id)} name="trash-alt" title="delete"/>
          <FontAwesome className="image-icon" onClick={() => this.props.expandPicture(this.props.dto)} name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
