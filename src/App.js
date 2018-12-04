import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Moment from 'react-moment';
import './App.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      counter: 0,
      articles: [],
      isMenuVisible: false,
      likeStatus: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.saveLikeState = this.saveLikeState.bind(this);
    this.createCards = this.createCards.bind(this);
  }

  componentDidMount() {
    fetch('https://newsapi.org/v2/top-headlines?' +
          'country=in&' +
          'apiKey=e7a30f81ddfb47d68694a74fc5ada100')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.articles,
            articles: result.articles.slice(0, 3),
          });
          if(this.state.items.length > 3){
            this.setState({counter: 3});
          }
          debugger;
          if(!localStorage.getItem("newsArticles")){
             localStorage.setItem("newsArticles", JSON.stringify(result.articles));
          }
          else {
            let resultArray = JSON.parse(localStorage.getItem("newsArticles"));
            this.setState({articles: resultArray.slice(0,3)})
          }
          },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
      window.addEventListener('scroll', this.handleScroll);

  }

  handleScroll() {
    if(window.scrollY + window.innerHeight == document.documentElement.offsetHeight) {
      let {counter, items} = this.state;
        debugger;
        let resultArray = JSON.parse(localStorage.getItem("newsArticles"));
        this.setState({counter: counter+3});
        this.setState({articles: resultArray.slice(0, this.state.counter)});
    }
  }

  saveLikeState(elementIndex, event) {
    debugger;
    let articles = JSON.parse(localStorage.getItem("newsArticles"));
    if(!articles)
      return
    articles[elementIndex]['likeStatus']= articles[elementIndex]['likeStatus'] ? false : true; 
    articles = articles.map(function(item, index) { return index == elementIndex ? articles[elementIndex] : item; });
    localStorage.setItem("newsArticles", JSON.stringify(articles));
    this.setState({items: articles, articles: articles.slice(0, this.state.counter)});
    this.forceUpdate();
  }

  createCards() {
    const {counter, articles} = this.state;
    let cards=[];
    for (let i=0; i<articles.length; i++) {
       cards.push(<div className="cards">
          <div className="cardHeader" key={i}>
              <div className="cardSource">
                <p>{articles[i].source.name}</p>
                <Moment format="YYYY/MM/DD">{articles[i].publishedAt}</Moment>
              </div>
          </div>
          <div className="cardImage">
            <img src={articles[i].urlToImage ? articles[i].urlToImage : `https://www.northampton.ac.uk/wp-content/uploads/2018/03/default-svp_news.jpg`} />
          </div>
          <div className="footerText">
            <div className="likeIcon">
              <i ref="heartIcon" id="heartIcon" className={`fa fa-heart ${articles[i].likeStatus ? `likedArticleIndicator` : `` }`} aria-hidden="true" onClick={(e) => this.saveLikeState(i)}></i>
            </div>
            <div className="titleContainer">
              <h3 className="title">{articles[i].title}</h3>
            </div>
        </div>
        </div>);
    }
    return cards;
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
      return (
        <div>
          {this.createCards()}
        </div>
      );
    }
  }
}

export default App;
