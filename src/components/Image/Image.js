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
      imageToDrop: null,
      blackAndWhite: false,
      enter: false,
      more: false
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
  setBlack = () => {
    this.setState({blackAndWhite: true})
    this.props.setBlack()
  }
  unsetBlack = () => {
    this.setState({blackAndWhite: false})
    this.props.unsetBlack()
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
          this.setState({enter: true})
          setTimeout(() => {
            this.setState({enter: false})
          }, 550)

        }}
        onDragEnd={(e) => {
          this.props.dragAndDrop(e)
        }}

        draggable={true}
        className={`image-root ${this.state.enter && 'drag-over'}`}
        style={{
          filter: this.state.blackAndWhite ? 'grayscale(100%)': 'none',
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          transform: `rotate(${this.state.rotation}deg)`
        }}
        onClick={() => this.props.expandPicture(this.props.dto)}
    >

      </div>
     {!this.state.more && <span className="more"onClick={() => this.setState({more: true})}>...</span>}
       {(this.state.more || this.props.modalOpen)&& <div
            className='tools-div'
        >
          <span className="show-less" onClick={() => this.setState({more: false})}> X </span>
          <FontAwesome className="image-icon" onClick={() => this.rotatePicture()} name="sync-alt" title="rotate"/>
          {!this.props.blackAndWhite && <div className="image-icon black-and-white" onClick={() => this.setBlack()}> <span> B&#38;W</span></div>}
          {this.props.blackAndWhite && <div className="image-icon black-and-white" onClick={() => this.unsetBlack()}> <span> B&#38;W</span></div>}
          <FontAwesome className="image-icon" onClick={() => this.props.deletePicture(this.props.dto.id)} name="trash-alt" title="delete"/>
        </div>}
      </div>
    );
  }
}

export default Image;
