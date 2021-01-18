import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Modal from 'react-modal'

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      expanded: false
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  deletePicture = (id) => {
    const newArray = this.state.images.filter(pic => pic.id !== id)
    this.setState({images: newArray})
  }
  
  expandPicture = (dto) => {
    this.state.expanded
    ?
    this.setState({expanded: !this.state.expanded, dto: dto})
    :
    this.setState({expanded: !this.state.expanded, dto: dto})
  }

  customStyles = {
    content : {
      backgroundColor: '#222222',
      borderRadius: '13px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  };

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} expandPicture={this.expandPicture} deletePicture={this.deletePicture} galleryWidth={this.state.galleryWidth}/>;
        })}
          
          {/* Adding modal for expanded image */}
          <Modal
            isOpen={this.state.expanded}
            onRequestClose={this.expandPicture.bind(this)}
            style={this.customStyles}
            contentLabel="Example Modal"
          >
            <div onClick={this.expandPicture.bind(this)} className='modal-close-button'>X</div>
            {this.state.dto && 
              <div className="modal-picture"> 
                <Image key={'image-' + this.state.dto.id} dto={this.state.dto} expanded={this.state.expanded}/> 
              </div>
            }
          </Modal>
      </div>
    );
  }
}

export default Gallery;
