import React, {Component} from 'react'
import request from 'superagent'

export default class CrimeDisplay extends Component {
  constructor (props) {
    super (props)
    const v = (this.props.value)
      ? this.props.value : ''
    this.state = {
      value: v,
      items: null
    }

  }
  handleChange (e) {
    const v = e.target.value
    const replaceValue = v.replace(/[\x01-\x7E]/g,'')
                          .replace(/^[^\x01-\x7E]{7,}$/,'')
                          .replace(/[０-９]+$/g,'')
    this.setState({
      value: replaceValue
    })

    if(this.props.onChange) {
      this.props.onChange({
        target: this,
        value: replaceValue
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value
    })
  }
  componentWillMount () {
    request
      .get('./data1.json')
      .accept('application/json')
      .end((err, res) => {
        this.loadedJSON(err, res)
      })
  }

  loadedJSON (err, res) {
    if (err) {
      console.log('JSON読み込みエラー')
      return
    }
    this.setState({
      items:res.body
    })
    
  }

  render () {
    if (!this.state.items) {
      return <div> 現在読み込み中</div>
    }
    const results = this.renderStatusMessage()

    return (<div>
      <label>都道府県の犯罪率を調べよう！ <br />
        <input type='text'
          placeholder='都道府県を入力'
          value={this.state.value}
          onChange = {e => this.handleChange(e)} />
        </label>
        <h2>検索結果</h2>
        {results}
      </div>)
    }

    renderStatusMessage () {

      let results = null
      const preinfo = this.state.items
                     .filter(item =>item.name === this.state.value)
                     .map(item => 
        <div key = {item.name}>
        <h3>{item.name}</h3>
        <p>犯罪発生件数{item.number}件</p>
        <p>人口{item.population}人</p>
        <p>人口1人当たりの犯罪発生率{item.ratio}%</p>
　　　　</div>)
      
      results = <div>{preinfo}</div>
     
      return results
    }
    
  }
