import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import Modal from 'react-modal'
import { indexOf } from 'core-js/fn/array';

Modal.setAppElement('#app')

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag,
      images: [],
      galleryWidth: this.getGalleryWidth(),
      expanded: false,
      page: 1,
      pages: null,
      imageToDrag: null,
      imageToDrop: null
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
          this.setState({images: [...res.photos.photo], pages: res.photos.pages});
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
    if(this.state.expanded) {
      this.setState({expanded: false})
    }
    // get new array without the deleted element
    const newArray = this.state.images.filter(pic => pic.id !== id)
    this.setState({images: newArray})
  }
  
  expandPicture = (dto) => {
    // open modal if user expands the picture
    this.state.expanded
    ?
    this.setState({expanded: !this.state.expanded, dto: dto})
    :
    this.setState({expanded: !this.state.expanded, dto: dto})
  }

   getNextImage = (tag, page) => {
     // fetch more pages from the api based on the tag
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=10&page=${page}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res =>res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
          ) {
          this.setState({images: [...this.state.images, ...res.photos.photo], page: res.photos.page + 1});
        }
      })
      .catch(err =>console.log(err))
  }

  modalStyle = {
    overlay: {
      backgroundColor: '#00000095',
    },
    content : {
      width: '85%',
      maxWidth: '900px',
      height: '80%',
      padding: '0',
      border: 'none',
      overflow: 'hidden',
      margin: 'auto auto',
      backgroundColor: 'transparent',
      borderRadius: '13px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  };


  onDrag = (e) => {
    const backgroundImage = e.currentTarget.style.backgroundImage
    const imageUrl = backgroundImage.split('').splice(5).slice(0, backgroundImage.length-7).join('')
    this.setState({imageToDrag: imageUrl})
  }
  onDrop = (e) => {
    const backgroundImage = e.currentTarget.style.backgroundImage
    const imageUrl = backgroundImage.split('').splice(5).slice(0, backgroundImage.length-7).join('')
    this.setState({imageToDrop: imageUrl})
  }
  
  dragAndDrop = (e) => {
    const images = this.state.images
    const urlToDrag = this.state.imageToDrag
    const dragID = urlToDrag.split('').splice(38).slice(0, urlToDrag.length-53).join('')
    const dragSECRET = urlToDrag.split('').splice(50).slice(0, urlToDrag.length-54).join('')
    const urlToDrop = this.state.imageToDrop
    const dropID = urlToDrop.split('').splice(38).slice(0, urlToDrop.length-53).join('')
    const dropSECRET = urlToDrop.split('').splice(50).slice(0, urlToDrop.length-54).join('')
    const indexToDrag = images.reduce((prev, cur, i) => {
      if(cur.id == dragID && cur.secret == dragSECRET){ 
        return i
      }
      return prev
    }, 0)
    const indexToDrop = images.reduce((prev, cur, i) => {
      if(cur.id == dropID && cur.secret == dropSECRET){ 
        return i
      }
      return prev
    }, 0)
    const tmp = images[indexToDrop]
    images[indexToDrop] = images[indexToDrag]
    images[indexToDrag] = tmp
    this.setState({images: images})
  }

  
  handleScroll = (e) => {
    // target is the .gallery-root div
    const target = e.target

    const scrollHeight = target.scrollHeight
    let scrollPos = target.offsetHeight + target.scrollTop

    console.log(scrollHeight, scrollPos)

    if(((scrollHeight - 700) >= scrollPos) / scrollHeight == 0) {
      //   //if yes, fetch more images
      this.getNextImage(this.props.tag, this.state.page)
     } 
  }
  render() {
    return (
      <div
        id='dragArea'
        className="gallery-root"
        onScroll={(e) => this.handleScroll(e)}
      >
          {this.state.images.map((dto, index) => {
            return <Image id={index} onDrag={e => this.onDrag(e)} dragAndDrop={e => this.dragAndDrop(e)}onDrop={e => this.onDrop(e)}key={'image-' + dto.id} dto={dto} expandPicture={this.expandPicture} deletePicture={this.deletePicture} galleryWidth={this.state.galleryWidth}/>;
          })}
          
            {/* Adding modal for expanded image */}
          <Modal
            isOpen={this.state.expanded}
            onRequestClose={this.expandPicture.bind(this)}
            style={this.modalStyle}
            contentLabel="Example Modal"
          >
            {this.state.dto &&
              <div className="modal-picture">
                <Image key={'image-' + this.state.dto.id} dto={this.state.dto} expandPicture={this.expandPicture} deletePicture={this.deletePicture} expanded={this.state.expanded}/>
              </div>
            }
          </Modal>
      </div>
    );
  }
}

export default Gallery;
