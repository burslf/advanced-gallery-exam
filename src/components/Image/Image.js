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
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      rotation: 0,
      expanded: false
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
    return size;
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotatePicture() {
    this.setState({rotation: this.state.rotation + 90})
  }

  expandPicture() {
    this.state.expanded 
    ?
    this.setState({expanded: !this.state.expanded})
    :
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    return (
      <div 
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          backgroundSize: "initial",
          backgroundRepeat: "no-repeat",
          width: this.state.expanded ? '95vw' : this.state.size + 'px',
          height: this.state.expanded ? '50vh' : this.state.size + 'px',
          transform: `rotate(${this.state.rotation}deg)`,
          border: this.state.expanded ? '0px solid white' : '1px solid white',
        }}
        >
        <div style={{transform: `rotate(-${this.state.rotation}deg)`}}>
          <FontAwesome className="image-icon" onClick={() => this.rotatePicture()} name="sync-alt" title="rotate"/>
          <FontAwesome className="image-icon" onClick={() => this.props.deletePicture(this.props.dto.id)} name="trash-alt" title="delete"/>
          <FontAwesome className="image-icon" onClick={() => this.expandPicture()} name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
