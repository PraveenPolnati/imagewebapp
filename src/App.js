import React from 'react'
import { ColorRing } from 'react-loader-spinner';

import {v4 as uudisv4} from 'uuid'
import { Component } from 'react';
import './App.css';

const shortcutButton = [
  'Animals','Trees','Fruits','Flowers','Birds','All'
]


class App extends Component{

  state={searchText:'Animals',dataList:[],pageNO:1,perPage:10,totalPages:1,isLoading:true}

  componentDidMount(){
    this.fetchImages()
    this.setState({searchText:''})
  }


  updateSearchText = (event)=>{
    this.setState({searchText:event.target.value})
  }

  fetchImages = async ()=>{
    const{searchText,pageNO,perPage} = this.state
    let newText = ''
    if(searchText===""){
      newText = "All"
    }else{
      newText = searchText
    }
    const url = `https://api.unsplash.com/search/photos?client_id=erRa3-MubqNFWhdFsbacI2nh5KkT07edTy5kF1r8wj4&query=${newText}&page=${pageNO}&per_page=${perPage}`
    const options = {Method:'GET'}
    const result = await fetch(url,options)
    const data = await result.json()
    console.log(data)
    this.setState({dataList:data.results,totalPages:data.total_pages,isLoading:false})
  }

  onClickSearch = (event)=>{
    event.preventDefault()
    this.setState({pageNO:1,isLoading:false})
    try {
      this.fetchImages()
    } catch (error) {
      console.log(error)
    }
  }

  pageIncrease = ()=>{
    this.setState(prevState => ({pageNO:prevState.pageNO + 1,isLoading:true}))
    this.fetchImages()
  }

  pageDecrease = ()=>{
    this.setState(prevState => ({pageNO:prevState.pageNO - 1,isLoading:true}))
    this.fetchImages()
  }

  render(){
    const {pageNO,searchText,dataList,totalPages,isLoading} = this.state
    console.log(dataList)
    return(
      <div className='bgContainer'>
        <div className='bgCard'>
        <h1 className='appHeading'>
          Images Search App
        </h1>
        <form onSubmit={this.onClickSearch} className='searchForm'>
          <input value={searchText} className='inputBox' onChange={this.updateSearchText} type='search' placeholder='Type here' />
          <button className='SearchButton' type='submit'>Search</button>
          <div className='btnCard'>
              {
                shortcutButton.map(each=> <button type='button' onClick={this.updateSearchText} className='btn' key={uudisv4()} value={each}>{each}</button>)
              }
          </div>  
        </form>
          {isLoading ? <ColorRing  color='white'/> :<ul className='imagesList'>
            {
                dataList.map((each) => 
                <div className='imagetextCard'  key={each.id}>
                  <img className='imageEle' height={200} width={200} src={each.urls.thumb} alt={each.alt_description}/>
                    <div className='textCard'>
                      <p className='text'>{each.alt_description}</p>
                    </div>
                </div>)
            }
          </ul>}
          <div>
            {dataList.length > 1 && <p className='pageNo'>{pageNO}</p>}
          </div>
          <div className='pageCard'>
            {pageNO > 1 && <button  onClick={this.pageDecrease} className='pageBtn' type='button'>Previous</button>}
            {pageNO < totalPages && <button className='pageBtn' type='button' onClick={this.pageIncrease}>Next</button>}
          </div>
        </div>
      </div>
    )
  }
}



export default App;