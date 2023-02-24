import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from './App.styled';
import ImageGallery from "./ImageGallery/ImageGallery";
import SearchBar from "./Searchbar/Searchbar";
import getImgByQuery from "../Services/Api";
import Loader from "./Loader/Loader";
import Button from "./Button/Button";
import Modal from "./Modal/Modal";

export default function App()  {
 
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [largeImageURL, setLargeImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState('');

 

  useEffect(() => { 
if (!query) return;
    fetchImages(query, page);
  }, [query, page]);


  const fetchImages = (query, page) => {
    const perPage = 12;
    setIsLoading(true);

    getImgByQuery(query, page, perPage)
      .then(({ hits, totalHits }) => {
        const totalPages = Math.ceil(totalHits / perPage);

        const data = hits.map(({ id, webformatURL, largeImageURL, tags }) => {
          return {
            id,
            webformatURL,
            largeImageURL,
            tags,
          };
        });

        setImages(images => [...images, ...data]);
        setTotal(totalHits);

        if (hits.length === 0) {
          return toast.error('Sorry, no images found. Please, try again!');
        }

        if (page === 1) {
          toast.success(`Hooray! We found ${totalHits} images.`);
        }

        if (page === totalPages) {
          toast.info("You've reached the end of search results.");
        }
      })
      .catch(error => setError(error))
      .finally(() => setIsLoading(false));
  };

  


  const formSubmit = query => {
    setImages([]);
    setQuery(query);
    setPage(1);
    setError(null);
     
  };
  
 const  loadMore = () => {
    setPage(page => page + 1,
    );
  };

  const toggleModal = (largeImageURL, tags) => {
    setShowModal(!showModal);
    setLargeImageURL(largeImageURL);
    setTags(tags);
  };

  
    
    const showBtn = images.length !== 0 && images.length !== total && !isLoading;
    return (
      <Container>
        <SearchBar onSubmit={formSubmit} />
        {error && toast.error(error.message)}
        {isLoading && <Loader />}
        <ImageGallery images={images} onClick={toggleModal} />
        {showBtn && <Button onClick={loadMore} />}
        {showModal && (
          <Modal onClose={toggleModal}>
            <img src={largeImageURL} alt={tags} />
          </Modal>
        )}
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      </Container>
    )
  }




// export default class App extends Component {
//   state = {
//     query: '',
//     page: 1,
//     images: [],
//     totalHits: null,
//     totalPages: null,
//     largeImageURL: null,
//     isLoading: false,
//     showModal: false,
//     error: null,
    
//   }

//   async componentDidUpdate(_, prevState) {
//     const { query, page } = this.state;

//     if (prevState.query !== query || prevState.page !== page) {
//       this.setState({ isLoading: true });
    
//     try {
//         const response = await getImgByQuery(query, page);
//         this.setState(prevState => ({
//           images: [...prevState.images, ...response.hits],
//           totalHits: response.totalHits,
//         }));
//       if (page === 1 && response.totalHits !== 0) {
//           toast.success(`Hooray! We found ${response.totalHits} images.`);
//         }
          
//       if (response.hits.length === 0) {
//           toast.error(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//         }
          
//       } catch (error) {
//         this.setState({ error: error.message });
//       } finally {
//         this.setState({ isLoading: false });
//       }
//     }
//   }

//   formSubmit = value => {
//     if (value.trim() === '') {
//       return toast.warning('Enter your request');
//     }
//     this.setState({
//       images: [],
//       query: value,
//       page: 1,
//     });
//   };
  
//   loadMore = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };

//   toggleModal = largeImageURL => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//     this.setState({ largeImageURL: largeImageURL });
//   };

//   render() {
//     const { images, isLoading, totalHits, showModal, largeImageURL, tags} = this.state;
//     const showBtn = images.length !== 0 && images.length !== totalHits && !isLoading;
//     return (
//       <Container>
//         <SearchBar onSubmit={this.formSubmit} />
//         {isLoading && <Loader />}
//         <ImageGallery images={images} onClick={this.toggleModal} />
//         {showBtn && <Button onClick={this.loadMore} />}
//         {showModal && (
//           <Modal onClose={this.toggleModal}>
//             <img src={largeImageURL} alt={tags} />
//           </Modal>
//         )}
//         <ToastContainer theme="colored" position="top-right" autoClose={3000} />
//       </Container>
//     )
//   }
// };